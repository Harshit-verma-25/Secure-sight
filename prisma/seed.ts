import { PrismaClient } from "../src/lib/prisma";
import { subHours, subMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data to avoid duplicates on re-seeding
  await prisma.incident.deleteMany();
  await prisma.camera.deleteMany();

  // Create Cameras and store them in variables
  const camera1 = await prisma.camera.create({
    data: {
      name: "Lobby Cam 01",
      location: "Main Entrance",
    },
  });

  const camera2 = await prisma.camera.create({
    data: {
      name: "Floor Cam 05",
      location: "Shop Floor A",
    },
  });

  const camera3 = await prisma.camera.create({
    data: {
      name: "Vault Cam 02",
      location: "Secure Vault",
    },
  });

  const now = new Date();

  // Incidents
  await prisma.incident.create({
    data: {
      type: "Gun Threat",
      tsStart: subMinutes(now, 15),
      tsEnd: subMinutes(now, 13),
      thumbnailUrl: "/thumbnail-1.png",
      resolved: false,
      cameraId: camera3.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Unauthorised Access",
      tsStart: subHours(now, 1),
      tsEnd: subHours(now, 1),
      thumbnailUrl: "/thumbnail-2.png",
      resolved: true,
      cameraId: camera1.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Gun Threat",
      tsStart: subHours(now, 2),
      tsEnd: subHours(now, 1),
      thumbnailUrl: "/thumbnail-3.png",
      resolved: false,
      cameraId: camera2.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Unauthorized Access",
      tsStart: subHours(now, 3),
      tsEnd: subHours(now, 2),
      thumbnailUrl: "/thumbnail-4.png",
      resolved: false,
      cameraId: camera1.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Theft",
      tsStart: subHours(now, 4),
      tsEnd: subHours(now, 3),
      thumbnailUrl: "/thumbnail-1.png",
      resolved: true,
      cameraId: camera2.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Fire Alarm",
      tsStart: subHours(now, 5),
      tsEnd: subHours(now, 4),
      thumbnailUrl: "/thumbnail-2.png",
      resolved: false,
      cameraId: camera3.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Power Outage",
      tsStart: subHours(now, 6),
      tsEnd: subHours(now, 5),
      thumbnailUrl: "/thumbnail-3.png",
      resolved: true,
      cameraId: camera1.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Unauthorized Access",
      tsStart: subHours(now, 7),
      tsEnd: subHours(now, 6),
      thumbnailUrl: "/thumbnail-4.png",
      resolved: false,
      cameraId: camera2.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Power Outage",
      tsStart: subHours(now, 8),
      tsEnd: subHours(now, 7),
      thumbnailUrl: "/thumbnail-1.png",
      resolved: true,
      cameraId: camera3.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Gun Threat",
      tsStart: subHours(now, 9),
      tsEnd: subHours(now, 8),
      thumbnailUrl: "/thumbnail-2.png",
      resolved: false,
      cameraId: camera1.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Bomb Threat",
      tsStart: subHours(now, 10),
      tsEnd: subHours(now, 9),
      thumbnailUrl: "/thumbnail-3.png",
      resolved: true,
      cameraId: camera2.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Bomb Threat",
      tsStart: subHours(now, 11),
      tsEnd: subHours(now, 10),
      thumbnailUrl: "/thumbnail-4.png",
      resolved: false,
      cameraId: camera3.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Power Outage",
      tsStart: subHours(now, 12),
      tsEnd: subHours(now, 11),
      thumbnailUrl: "/thumbnail-1.png",
      resolved: true,
      cameraId: camera1.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Unauthorized Access",
      tsStart: subHours(now, 13),
      tsEnd: subHours(now, 12),
      thumbnailUrl: "/thumbnail-2.png",
      resolved: false,
      cameraId: camera2.id,
    },
  });

  await prisma.incident.create({
    data: {
      type: "Bomb Threat",
      tsStart: subHours(now, 14),
      tsEnd: subHours(now, 13),
      thumbnailUrl: "/thumbnail-3.png",
      resolved: true,
      cameraId: camera3.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
