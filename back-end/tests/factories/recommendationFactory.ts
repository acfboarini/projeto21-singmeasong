import { faker } from "@faker-js/faker";
import { prisma } from "../../src/database.js";
import { generateRandomNumberWithinRange } from "../utils/utilFunctions.js";

export async function createRecommendation() {
    const recommendationData = {
        name: faker.music.songName(),
        youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`
    };
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
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`
        })
    };
    const recommendations = await prisma.recommendation.createMany({
        data: listRecommendation
    });
    return recommendations;
}

export async function createManyRecommendationsWithRandomScores() {
    const listRecommendation = [];
    for (let i = 0; i < 11; i++) {
        listRecommendation.push({
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`,
            score: +faker.random.numeric(3),
        })
    };
    await prisma.recommendation.createMany({
        data: listRecommendation 
    });
}

export function createManyRecommendationsLessThanMaxScore(maxScore: number) {
    const listRecommendation = [];
    for (let i = 0; i < 11; i++) {
        const score = generateRandomNumberWithinRange(-5, maxScore);
        listRecommendation.push({
            id: (i + 1),
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`,
            score,
        })
    };
    return listRecommendation;
}
