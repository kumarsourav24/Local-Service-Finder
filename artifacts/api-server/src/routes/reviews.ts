import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { reviewsTable, workersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/reviews", async (req, res) => {
  try {
    const { workerId } = req.query;
    if (!workerId) {
      return res.status(400).json({ error: "workerId is required" });
    }

    const reviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.workerId, parseInt(workerId as string)))
      .orderBy(reviewsTable.createdAt);

    return res.json(
      reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const body = req.body;
    const [review] = await db
      .insert(reviewsTable)
      .values({
        workerId: body.workerId,
        userId: body.userId,
        userName: body.userName,
        rating: body.rating,
        comment: body.comment,
        bookingId: body.bookingId ?? null,
      })
      .returning();

    await db
      .update(workersTable)
      .set({
        completedJobs: (await db
          .select()
          .from(reviewsTable)
          .where(eq(reviewsTable.workerId, body.workerId))).length,
      })
      .where(eq(workersTable.id, body.workerId));

    return res.status(201).json({
      ...review,
      createdAt: review.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
