import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { createRecommendation } from "../factories/recommendationFactory.js";

describe("recommendation test unit test suite", () => {

    beforeEach(async () => {
        jest.clearAllMocks();
    })

    it ("should create a recommendation", async () => {
        const recommendation = {
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`
        }

        jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(async () => {});

        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toBeCalledTimes(1);
    })

    it ("should be conflict error to create duplicate recommendation", async () => {
        const recommendation = {
            name: faker.music.songName(),
            youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric()}`
        }

        jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
            id: 1,
            score: 0,
            ...recommendation
        });
        jest.spyOn(recommendationRepository, "create");

        const promise = await recommendationService.insert(recommendation);
        expect(promise).rejects.toThrowError("Error");
        expect(recommendationRepository.create).not.toBeCalled();
    })
})