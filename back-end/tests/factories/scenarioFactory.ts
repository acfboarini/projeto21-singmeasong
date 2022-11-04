import { prisma } from "../../src/database";

export async function deleteAllData() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations CASCADE`;
}

export async function createRecommendationsForGetRandom() {
    return
}

export async function createRecommendationsForGetTop() {
    return
}