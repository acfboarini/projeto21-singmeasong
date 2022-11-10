/* eslint-disable no-undef */
/// <reference types="cypress" />

//import { faker } from "@faker-js/faker";

beforeEach(() => {
    cy.request("POST", "http://localhost:5000/reset", {}); 
})

describe("testing e2e", () => {

    it ("testing initial page", () => {
        cy.visit("http://localhost:3000");
    });
})