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
        const recommendation = {
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        }

        const result = await agent.post("/recommendations").send(recommendation);
        expect(result.statusCode).toEqual(201);

        // testando efeito colateral
        const recommendationCreated = prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            }
        });
        expect(recommendationCreated).not.toBeNull();
    });

    it("testing post recommendation with conflict", async () => {
        const recommendation = await createRecommendation();

        // testando conflito
        const result = await agent.post("/recommendations").send(recommendation);
        expect(result.statusCode).toEqual(409);
    });

    it("testing recommendation upvote", async () => {
        const recommendation = await createRecommendation();

        // buscando recomendacao criada
        const recommendationCreated = await prisma.recommendation.findUnique({
            where: {
                name: recommendation.name
            }
        })
        // testando aumento de pontuacao
        const result = await agent.post(`/recommendations/${recommendationCreated.id}/upvote`);
        expect(result.statusCode).toEqual(200);
    })
})

afterAll(() => {
    prisma.$disconnect();
})