process.env.NODE_ENV = 'test';

const request = require("supertest");

const app = require("../app");
const items = require('../fakeDb');
const Test = require("supertest/lib/test");

let shampoo = { name: "Head & Shoulders", price: 8.50 }

beforeEach(function() {
    items.push(shampoo);
})

afterEach(function() {
    // Make sure to *just* mutate, *not* redefine
    items.length = 0;
})

describe("GET items", () => {
    test("/items should return json list of all shopping list items", async () => {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ items: [shampoo] });
    })
})

describe("POST items", () => {
    test("Posting /items adds new item to shopping list, returns new item added", async () => {
        const resp = await request(app).post('/items').send({name: "test item", price: 10.95 });
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual({ added: { name: "test item", price: 10.95 } });
    })
})

describe("GET /items/:name", () => {
    test("Should return a single item's name and price", async () => {
        const resp = await request(app).get(`/items/${shampoo.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(shampoo);
    })
})

describe("PATCH /items/:name", () => {
    test("Should modify a single item and return it's name and price", async () => {
        const resp = await request(app).patch(`/items/${shampoo.name}`).send({name: "conditioner", price: 20.99});
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({updated: {name: "conditioner", price: 20.99}});
    })
})

describe("DELETE /items/:name", () => {
    test("Should delete a single item and return message: 'Deleted'", async () => {
        const resp = await request(app).delete(`/items/${shampoo.name}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({ message: "Deleted"} );
        // No items left in the items array
        expect(items.length).toEqual(0);
    })
})