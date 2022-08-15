import { Request, Response } from "express";
import { recommendationRepository } from "../repositories/recommendationRepository.js";

export async function reset(req: Request, res: Response) {
    await recommendationRepository.reset();
    res.send(200);
}