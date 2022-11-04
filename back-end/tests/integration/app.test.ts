import supertest from "supertest";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import { createManyRecommendations, createManyRecommendationsWithScores, createRecommendation } from "../factories/recommendationFactory.js";
import { deleteAllData } from "../factories/scenarioFactory.js";
import { compareScores } from "../utils/utilFunctions.js";

dotenv.config();

const agent = supertest(app);

describe("testing recomendations...", () => {
    beforeEach(async () => {
        await deleteAllData();
    });

    it("testing post recommendation", async () => {
        const recommendationCreated = {
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric()}`
        };

        const result = await agent.post("/recommendations").send(recommendationCreated);
        expect(result.statusCode).toEqual(201);

        // testando efeito colateral
        const recommendation = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });
        expect(recommendation).not.toBeNull();
    });

    it("testing post recommendation with conflict", async () => {
        const recommendationCreated = await createRecommendation();

        const result = await agent.post("/recommendations").send({
            name: recommendationCreated.name,
            youtubeLink: recommendationCreated.youtubeLink
        });
        expect(result.statusCode).toEqual(409);
    });

    it("testing recommendation upvote", async () => {
        const recommendationCreated = await createRecommendation();

        const result = await agent.post(`/recommendations/${recommendationCreated.id}/upvote`);
        expect(result.statusCode).toEqual(200);

        //testando efeito colateral
        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });

        const diff = recommendationUpdate.score - recommendationCreated.score;
        expect(diff).toEqual(1);
    });

    it("testing recommendation downvote", async () => {
        const recommendationCreated = await createRecommendation();

        const result = await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);
        expect(result.statusCode).toEqual(200);

        //testando efeito colateral
        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });

        const diff = recommendationUpdate.score - recommendationCreated.score;
        expect(diff).toEqual(-1);
    });

    it("testing delete recommendation if score < -5", async () => {
        const recommendationCreated = await createRecommendation();
        for (let i = 0; i < 5; i++) {
            await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);
        };

        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });
        expect(recommendationUpdate.score).toEqual(-5);

        await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);
        const recommendationDeleted = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });
        expect(recommendationDeleted).toBeNull();
    });

    it("testing get recommendations", async () => {
        await createManyRecommendations();
        
        const listRecommendations = await agent.get("/recommendations");
        expect(listRecommendations.body).toHaveLength(10);

        const ultimo  = listRecommendations.body.length - 1;
        const diff = listRecommendations.body[0].id - listRecommendations.body[ultimo].id + 1
        expect(diff).toEqual(10);
    });

    it("testing get recommendation by id", async () => {
        const { id } = await createRecommendation();
        
        const recommendation = await agent.get(`/recommendations/${id}`);
        expect(recommendation.body.id).toEqual(id);
    });

    it ("testindo get top recommendations", async () => {
        await createManyRecommendationsWithScores();
        const amount = +faker.random.numeric();
        console.log(amount);

        const result = await agent.get(`/recommendations/top/${amount}`);
        expect(result.body.length).toEqual(amount);

        const validate = compareScores(result.body);
        expect(validate).toEqual(true);
    });

    it("testing get random recommendations without any music", async () => {   
        const recommendation = await agent.get(`/recommendations/random`);
        expect(recommendation.statusCode).toEqual(404);
    });

    afterAll(async () => {
        await deleteAllData();
        await prisma.$disconnect();
    });
});