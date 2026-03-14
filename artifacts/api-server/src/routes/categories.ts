import { Router, type IRouter } from "express";

const router: IRouter = Router();

const categories = [
  { id: "electrician", name: "Electrician", icon: "⚡", description: "Wiring, repairs, installations" },
  { id: "plumber", name: "Plumber", icon: "🔧", description: "Pipes, leaks, fixtures" },
  { id: "mechanic", name: "Mechanic", icon: "🔩", description: "Car & vehicle repairs" },
  { id: "tutor", name: "Home Tutor", icon: "📚", description: "Academic tutoring" },
  { id: "carpenter", name: "Carpenter", icon: "🪚", description: "Furniture, woodwork" },
  { id: "painter", name: "Painter", icon: "🎨", description: "Interior & exterior painting" },
  { id: "ac_repair", name: "AC Repair", icon: "❄️", description: "AC service & repair" },
  { id: "cleaner", name: "House Cleaner", icon: "🧹", description: "Deep cleaning, maid services" },
  { id: "pest_control", name: "Pest Control", icon: "🐛", description: "Pest extermination" },
  { id: "welder", name: "Welder", icon: "🔥", description: "Metal work & welding" },
];

router.get("/categories", (_req, res) => {
  res.json(categories);
});

export default router;
