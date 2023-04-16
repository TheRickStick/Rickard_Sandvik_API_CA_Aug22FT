const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

app.use(bodyParser.json());

app.use("/", authRoutes);

describe("testing-guest-routes", () => {
  let token;

  test("POST /login - success", async () => {
    const credentials = {
        email: "johndoe@example.com",
        password: "password123"
    }
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("token");
    token = body.data.token
    console.log(token)
  });

  test("GET / - success", async () => {
    const { body } = await request(app).get("/").set("Authorization", `Bearer ${token}`);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data).toBeInstanceOf(Array);
  });



});
