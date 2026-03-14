import { db } from "@workspace/db";
import { workersTable, reviewsTable } from "@workspace/db/schema";

const workers = [
  {
    name: "Ramesh Kumar",
    categoryId: "electrician",
    experience: 6,
    pricePerHour: 500,
    serviceArea: "Hyderabad",
    bio: "Expert electrician with 6 years experience in residential and commercial wiring, panel upgrades, and repairs.",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@example.com",
    lat: 17.3850,
    lng: 78.4867,
    isAvailableEmergency: true,
    isOnline: true,
    skills: ["Wiring", "Panel Upgrades", "Lighting", "Safety Inspection"],
    completedJobs: 145,
  },
  {
    name: "Suresh Patel",
    categoryId: "plumber",
    experience: 8,
    pricePerHour: 450,
    serviceArea: "Hyderabad",
    bio: "Professional plumber specializing in pipe repairs, bathroom fitting, and water leakage solutions.",
    phone: "+91 87654 32109",
    email: "suresh.patel@example.com",
    lat: 17.3920,
    lng: 78.4950,
    isAvailableEmergency: true,
    isOnline: true,
    skills: ["Pipe Repair", "Bathroom Fitting", "Water Heater", "Drainage"],
    completedJobs: 210,
  },
  {
    name: "Vijay Sharma",
    categoryId: "mechanic",
    experience: 10,
    pricePerHour: 600,
    serviceArea: "Hyderabad",
    bio: "Certified auto mechanic with expertise in all car brands. Quick service at your doorstep.",
    phone: "+91 76543 21098",
    email: "vijay.sharma@example.com",
    lat: 17.3750,
    lng: 78.4800,
    isAvailableEmergency: true,
    isOnline: true,
    skills: ["Engine Repair", "Brake Service", "Oil Change", "Tyre Replacement"],
    completedJobs: 320,
  },
  {
    name: "Priya Reddy",
    categoryId: "tutor",
    experience: 5,
    pricePerHour: 400,
    serviceArea: "Hyderabad",
    bio: "Experienced home tutor for Class 6-12 students in Maths and Science with excellent results.",
    phone: "+91 65432 10987",
    email: "priya.reddy@example.com",
    lat: 17.3900,
    lng: 78.5000,
    isAvailableEmergency: false,
    isOnline: true,
    skills: ["Mathematics", "Physics", "Chemistry", "Class 10 Board Prep"],
    completedJobs: 80,
  },
  {
    name: "Manoj Singh",
    categoryId: "carpenter",
    experience: 12,
    pricePerHour: 550,
    serviceArea: "Hyderabad",
    bio: "Master carpenter offering custom furniture, door & window fitting, and woodwork repairs.",
    phone: "+91 54321 09876",
    email: "manoj.singh@example.com",
    lat: 17.3800,
    lng: 78.4900,
    isAvailableEmergency: false,
    isOnline: false,
    skills: ["Furniture Making", "Door Fitting", "Woodwork", "Polishing"],
    completedJobs: 198,
  },
  {
    name: "Ravi Nair",
    categoryId: "ac_repair",
    experience: 7,
    pricePerHour: 700,
    serviceArea: "Hyderabad",
    bio: "AC repair specialist for all brands. Servicing, gas refill, and installation at best rates.",
    phone: "+91 43210 98765",
    email: "ravi.nair@example.com",
    lat: 17.3950,
    lng: 78.4750,
    isAvailableEmergency: true,
    isOnline: true,
    skills: ["AC Servicing", "Gas Refill", "Installation", "All Brands"],
    completedJobs: 267,
  },
  {
    name: "Kavya Iyer",
    categoryId: "painter",
    experience: 4,
    pricePerHour: 350,
    serviceArea: "Hyderabad",
    bio: "Creative painter offering interior and exterior painting with quality materials and neat finish.",
    phone: "+91 32109 87654",
    email: "kavya.iyer@example.com",
    lat: 17.3700,
    lng: 78.4850,
    isAvailableEmergency: false,
    isOnline: true,
    skills: ["Interior Painting", "Exterior Painting", "Texture Finish", "Waterproofing"],
    completedJobs: 56,
  },
  {
    name: "Deepak Yadav",
    categoryId: "cleaner",
    experience: 3,
    pricePerHour: 300,
    serviceArea: "Hyderabad",
    bio: "Professional house cleaning service with eco-friendly products and trained staff.",
    phone: "+91 21098 76543",
    email: "deepak.yadav@example.com",
    lat: 17.4000,
    lng: 78.4900,
    isAvailableEmergency: false,
    isOnline: true,
    skills: ["Deep Cleaning", "Kitchen Cleaning", "Bathroom Cleaning", "Sofa Cleaning"],
    completedJobs: 112,
  },
];

const reviewTemplates = [
  { rating: 5, comment: "Excellent work! Very professional and quick." },
  { rating: 5, comment: "Very satisfied with the service. Highly recommended!" },
  { rating: 4, comment: "Good work done on time. Will hire again." },
  { rating: 4, comment: "Professional and knowledgeable. Reasonable pricing." },
  { rating: 5, comment: "Outstanding service! Fixed everything perfectly." },
  { rating: 3, comment: "Decent work but arrived a bit late." },
  { rating: 5, comment: "Superb quality and very courteous. 5 stars!" },
];

const userNames = ["Anita Sharma", "Rajesh Gupta", "Meena Patel", "Sanjay Kumar", "Lata Reddy", "Arjun Nair"];

async function seed() {
  console.log("Seeding database...");

  const existing = await db.select().from(workersTable);
  if (existing.length > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  const insertedWorkers = await db.insert(workersTable).values(workers).returning();
  console.log(`Inserted ${insertedWorkers.length} workers`);

  for (const worker of insertedWorkers) {
    const numReviews = Math.floor(Math.random() * 5) + 3;
    const reviewsToInsert = Array.from({ length: numReviews }, (_, i) => {
      const template = reviewTemplates[i % reviewTemplates.length];
      return {
        workerId: worker.id,
        userId: `user_${Math.floor(Math.random() * 1000)}`,
        userName: userNames[i % userNames.length],
        rating: template.rating,
        comment: template.comment,
        bookingId: null,
      };
    });
    await db.insert(reviewsTable).values(reviewsToInsert);
    console.log(`Inserted ${numReviews} reviews for ${worker.name}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
