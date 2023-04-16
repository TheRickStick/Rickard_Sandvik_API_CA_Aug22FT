const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");

app.use(bodyParser.json());

app.use("/", authRoutes);

describe("testing-guest-routes", () => {
  let token;

  test("POST /signup - success", async () => {
    const credentials = {
      name: "testuser",
      email: "test@test.com",
      password: "test"
    }
    const { body } = await request(app).post("/signup").send(credentials);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("You created an account.")
  });

  test("POST /login - success", async () => {
    const credentials = {
      email: "test@test.com",
      password: "test"
    }
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("token");
    token = body.data.token
    console.log(token)
  });


  test("DELETE / - success", async () => {
    const credentials = {
      email: "test@test.com",
    }
    const { body } = await request(app).delete("/").send(credentials);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("You deleted an account.")
  });
});
