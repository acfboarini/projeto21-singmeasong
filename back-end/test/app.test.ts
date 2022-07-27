import supertest from "supertest";
import dotenv from "dotenv";
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import { createRecommendation } from "./factories/recommendationFactory.js";

dotenv.config();

export const agent = supertest(app);

beforeEach(async () => {
    
})

describe("iniciando testes de integração", () => {

    it("testing post recommendation", async () => {
        const recommendationCreated = await createRecommendation();

        const result = await agent.post("/recommendations").send(recommendationCreated);
        expect(result.statusCode).toEqual(201);

        // testando efeito colateral
        const recommendation = prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        });
        expect(recommendation).not.toBeNull();
    });

    it("testing post recommendation with conflict", async () => {
        const recommendationCreated = await createRecommendation();

        // testando conflito
        const result = await agent.post("/recommendations").send({
            name: recommendationCreated.name,
            youtubeLink: recommendationCreated.youtubeLink
        });
        expect(result.statusCode).toEqual(409);
    });

    it("testing recommendation upvote", async () => {
        const recommendationCreated = await createRecommendation();

        // testando aumento da pontuacao
        const result = await agent.post(`/recommendations/${recommendationCreated.id}/upvote`);
        expect(result.statusCode).toEqual(200);

        //testando efeito colateral
        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        })

        const diff = recommendationUpdate.score - recommendationCreated.score;
        expect(diff).toEqual(1);
    })

    it("testing recommendation downvote", async () => {
        const recommendationCreated = await createRecommendation();

        // testando diminuição da pontuacao
        const result = await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);
        expect(result.statusCode).toEqual(200);

        //testando efeito colateral
        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        })

        const diff = recommendationUpdate.score - recommendationCreated.score;
        expect(diff).toEqual(-1);
    })

    it("testing delete recommendation if score < -5", async () => {
        const recommendationCreated = await createRecommendation();

        // diminuindo pontuacao 5 vezes
        for (let i = 0; i < 5; i++) {
            await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);
        }

        //testando efeito colateral
        const recommendationUpdate = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        })
        expect(recommendationUpdate.score).toEqual(-5);

        // testando se recomendacao foi excluida
        await agent.post(`/recommendations/${recommendationCreated.id}/downvote`);

        const recommendationDeleted = await prisma.recommendation.findUnique({
            where: {
                name: recommendationCreated.name
            }
        })
        expect(recommendationDeleted).toBeNull();
    })

    it("")
})

afterAll(() => {
    prisma.$disconnect();
})