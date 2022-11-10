import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { createManyRecommendationsLessThanMaxScore } from "../factories/recommendationFactory.js";
import { validateScores } from "../utils/utilFunctions.js";

jest.mock("../../src/repositories/recommendationRepository.js");

describe("testing recommendation service...", () => {

    let recommendation = {
        name: faker.music.songName(),
        youtubeLink: `www.youtube.com/watch?v=${faker.random.alphaNumeric(4)}`
    };

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it ("should create recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(async () => {});

        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toBeCalledTimes(1);
    });

    it ("shouldn't create recommendation because duplicate", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce({
            id: 1,
            score: 0,
            ...recommendation
        });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(async () => {});

        try {
            await recommendationService.insert(recommendation);
        } catch (error) {
            expect(error.type).toEqual("conflict"); 
        }
        expect(recommendationRepository.create).not.toBeCalled();
    });

    it ("should upvote recommendation", async () => {
        jest.spyOn(recommendationService, "getById").mockImplementation((): any => {});
        jest.spyOn(recommendationRepository, "find").mockResolvedValue({
            id: 1,
            score: 0,    
            ...recommendation
        })
        jest.spyOn(recommendationRepository, "updateScore");

        await recommendationService.upvote(3);
        expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1);
    });

    it ("should downvote recommendation and exclude recommendation", async () => {
        jest.spyOn(recommendationService, "getById").mockImplementation((): any => {});
        jest.spyOn(recommendationRepository, "find").mockResolvedValue({
            id: 1,
            score: 0,    
            ...recommendation
        });
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValueOnce({
            id: 1,
            score: -6,    
            ...recommendation
        });
        jest.spyOn(recommendationRepository, "remove");

        await recommendationService.downvote(3);
        expect(recommendationRepository.updateScore).toHaveBeenCalledTimes(1);
        expect(recommendationRepository.remove).toHaveBeenCalledTimes(1);
    });

    it ("shouldn't return recommendation because not found music", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
        try {
            await recommendationService.getRandom();
        } catch (error) {
            expect(error.type).toEqual("not_found");
        }
    });

    it ("should return any random recommendation because only exist scores < 10 or >= 10", async () => {
        const recommendations = createManyRecommendationsLessThanMaxScore(9);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue(recommendations);

        const listRecommendations = [];
        for (let i = 0; i < 5; i++) {
            const recommendation = await recommendationService.getRandom();
            listRecommendations.push(recommendation);
        }
        const validate = validateScores(listRecommendations, 9);
        expect(validate).toBeTruthy();
    });

    afterAll(() => {
        jest.resetAllMocks();
    })
})