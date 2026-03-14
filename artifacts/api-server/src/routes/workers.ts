import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { workersTable } from "@workspace/db/schema";
import { eq, ilike, or } from "drizzle-orm";

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

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

async function getAverageRating(workerId: number): Promise<{ rating: number; count: number }> {
  const { reviewsTable } = await import("@workspace/db/schema");
  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.workerId, workerId));
  if (reviews.length === 0) return { rating: 0, count: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { rating: Math.round(avg * 10) / 10, count: reviews.length };
}

router.get("/workers", async (req, res) => {
  try {
    let query = db.select().from(workersTable).$dynamic();

    const { category, search, emergency } = req.query;

    if (category && typeof category === "string") {
      query = query.where(eq(workersTable.categoryId, category));
    }

    if (search && typeof search === "string") {
      query = query.where(
        or(
          ilike(workersTable.name, `%${search}%`),
          ilike(workersTable.serviceArea, `%${search}%`)
        )
      );
    }

    if (emergency === "true") {
      query = query.where(eq(workersTable.isAvailableEmergency, true));
    }

    const workers = await query;

    const userLat = req.query.lat ? parseFloat(req.query.lat as string) : null;
    const userLng = req.query.lng ? parseFloat(req.query.lng as string) : null;

    const result = await Promise.all(
      workers.map(async (w) => {
        const { rating, count } = await getAverageRating(w.id);
        const distance =
          userLat !== null && userLng !== null
            ? calcDistance(userLat, userLng, w.lat, w.lng)
            : null;
        return {
          id: w.id,
          name: w.name,
          category: categoryNames[w.categoryId] || w.categoryId,
          categoryId: w.categoryId,
          experience: w.experience,
          rating,
          reviewCount: count,
          pricePerHour: w.pricePerHour,
          serviceArea: w.serviceArea,
          distance,
          isAvailableEmergency: w.isAvailableEmergency,
          isOnline: w.isOnline,
          avatarUrl: w.avatarUrl ?? null,
          bio: w.bio,
        };
      })
    );

    if (userLat !== null && userLng !== null) {
      result.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/workers", async (req, res) => {
  try {
    const body = req.body;
    const [worker] = await db
      .insert(workersTable)
      .values({
        name: body.name,
        categoryId: body.categoryId,
        experience: body.experience,
        pricePerHour: body.pricePerHour,
        serviceArea: body.serviceArea,
        bio: body.bio,
        phone: body.phone,
        email: body.email,
        lat: body.lat,
        lng: body.lng,
        isAvailableEmergency: body.isAvailableEmergency ?? false,
        isOnline: true,
        skills: body.skills ?? [],
        completedJobs: 0,
      })
      .returning();

    res.status(201).json({
      ...worker,
      category: categoryNames[worker.categoryId] || worker.categoryId,
      rating: 0,
      reviewCount: 0,
      distance: null,
      skills: worker.skills,
      createdAt: worker.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/workers/:workerId", async (req, res) => {
  try {
    const workerId = parseInt(req.params.workerId);
    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, workerId));

    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const { rating, count } = await getAverageRating(workerId);

    return res.json({
      ...worker,
      category: categoryNames[worker.categoryId] || worker.categoryId,
      rating,
      reviewCount: count,
      distance: null,
      skills: worker.skills,
      createdAt: worker.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/workers/:workerId/availability", async (req, res) => {
  const slots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM"
  ];

  const available = slots.map((time) => ({
    time,
    available: Math.random() > 0.3,
  }));

  res.json(available);
});

router.get("/workers/:workerId/dashboard", async (req, res) => {
  try {
    const workerId = parseInt(req.params.workerId);
    const { bookingsTable, reviewsTable } = await import("@workspace/db/schema");

    const [worker] = await db.select().from(workersTable).where(eq(workersTable.id, workerId));
    if (!worker) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.workerId, workerId));
    const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.workerId, workerId));

    const completedBookings = bookings.filter((b) => b.status === "completed");
    const pendingBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const avgRating = reviews.length > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
      : 0;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyEarnings = days.map((day) => ({
      day,
      earnings: Math.floor(Math.random() * 2000) + 500,
    }));

    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((b) => ({
        ...b,
        workerName: worker.name,
        workerCategory: categoryNames[worker.categoryId] || worker.categoryId,
        createdAt: b.createdAt.toISOString(),
      }));

    return res.json({
      workerId,
      totalEarnings: Math.round(totalEarnings),
      totalJobs: bookings.length,
      completedJobs: completedBookings.length,
      pendingJobs: pendingBookings.length,
      averageRating: avgRating,
      recentBookings,
      weeklyEarnings,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
