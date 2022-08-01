/// <reference types="cypress" />

//import { faker } from "@faker-js/faker";

describe("testing e2e", () => {
    it ("testing initial page", () => {
        // eslint-disable-next-line no-undef
        cy.visit("https://localhost:3000/");
    })
})