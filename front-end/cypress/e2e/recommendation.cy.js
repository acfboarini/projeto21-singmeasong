/// <reference types="cypress" />

describe("testing e2e", () => {
    beforeEach(() => {
        cy.request("POST", "http://localhost:5000/reset", {}); 
    })

    it ("testing initial page", () => {
        cy.visit("http://localhost:3000");
    });
})