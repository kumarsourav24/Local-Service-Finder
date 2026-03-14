import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import workersRouter from "./workers";
import bookingsRouter from "./bookings";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(workersRouter);
router.use(bookingsRouter);
router.use(reviewsRouter);

export default router;
