import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";

export async function createRecommendation() {
    const recommendationData = {
        name: faker.music.songName(),
        youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric()}`
    }

    const recommendation = await prisma.recommendation.create({
        data: recommendationData
    });

    return recommendation;
}

export async function createManyRecommendations() {

    const listRecommendation = [];

    for (let i = 0; i < 11; i++) {

        listRecommendation.push({
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric()}`
        })
    }

    const recommendations = await prisma.recommendation.createMany({
        data: listRecommendation
    })

    return recommendations;
}