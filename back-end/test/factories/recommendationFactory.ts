import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

export async function createRecommendation() {
    const recommendationData = {
        name: faker.music.songName(),
        youtubeLink: faker.internet.url()
    }

    const recommendation = await prisma.recommendation.create({
        data: recommendationData
    });

    return recommendation;
}