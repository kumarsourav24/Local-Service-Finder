import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, workersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const categoryNames: Record<string, string> = {
  electrician: "Electrician",
  plumber: "Plumber",
  mechanic: "Mechanic",
  tutor: "Home Tutor",
  carpenter: "Carpenter",
  painter: "Painter",
  ac_repair: "AC Repair",
  cleaner: "House Cleaner",
  pest_control: "Pest Control",
  welder: "Welder",
};

async function formatBooking(b: typeof bookingsTable.$inferSelect) {
  const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, b.workerId));
  return {
    ...b,
    workerName: worker?.name ?? "Unknown",
    workerCategory: worker ? (categoryNames[worker.categoryId] || worker.categoryId) : "Unknown",
    createdAt: b.createdAt.toISOString(),
  };
}

router.get("/bookings", async (req, res) => {
  try {
    const { workerId, userId } = req.query;
    let query = db.select().from(bookingsTable).$dynamic();

    if (workerId) {
      query = query.where(eq(bookingsTable.workerId, parseInt(workerId as string)));
    } else if (userId) {
      query = query.where(eq(bookingsTable.userId, userId as string));
    }

    const rows = await query;
    const result = await Promise.all(rows.map(formatBooking));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const body = req.body;
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, body.workerId));
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const totalAmount = worker.pricePerHour * 2;

    const [booking] = await db
      .insert(bookingsTable)
      .values({
        workerId: body.workerId,
        userId: body.userId,
        userName: body.userName,
        userPhone: body.userPhone,
        serviceDate: body.serviceDate,
        serviceTime: body.serviceTime,
        address: body.address,
        description: body.description,
        status: "pending",
        totalAmount,
        paymentMethod: body.paymentMethod,
        isEmergency: body.isEmergency ?? false,
      })
      .returning();

    return res.status(201).json(await formatBooking(booking));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings/:bookingId", async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId));
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    return res.json(await formatBooking(booking));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/bookings/:bookingId", async (req, res) => {
  try {
    const bookingId = parseInt(req.params.bookingId);
    const { status } = req.body;

    const [updated] = await db
      .update(bookingsTable)
      .set({ status })
      .where(eq(bookingsTable.id, bookingId))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Booking not found" });
    }

    return res.json(await formatBooking(updated));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
