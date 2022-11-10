import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";

export async function deleteAllData() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE`;
}