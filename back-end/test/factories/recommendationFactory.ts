import { faker } from "@faker-js/faker";
import { agent } from "../app.test.js";

export async function createRecommendation() {
    const recommendation = {
        name: faker.music.songName(),
        youtubeLink: faker.internet.url()
    }

    const result = await agent.post("/recommendations").send(recommendation);
    expect(result.statusCode).toEqual(201);

    return recommendation;
}