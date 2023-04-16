const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const db = require("./models");
const UserService = require("./services/UserService");
const userService = new UserService(db);
const { TodoService } = require("./services/TodoService"); // Import TodoService
//const todoService = new TodoService(db); // Initialize TodoService
app.use(bodyParser.json());
app.use("/", authRoutes);

describe("testing-auth-routes", () => {
  let token;

  beforeAll(async () => {
    await userService.create("testuser", "test@test.com", "test");
  });


  test("POST /signup - success", async () => {
    const credentials = {
      name: "testuser2",
      email: "test2@test.com",
      password: "test"
    };
    const { body } = await request(app).post("/signup").send(credentials);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data.result", "You created an account.");
  });

  test("POST /login - success", async () => {
    const credentials = {
      email: "test@test.com",
      password: "test"
    };
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data.token");
    token = body.data.token;
  });

  test("POST /login - invalid credentials", async () => {
    const credentials = {
      email: "test@test.com",
      password: "invalid"
    };
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("status", "fail");
    expect(body).toHaveProperty("data.result", "Incorrect email or password");
  });

  test("POST /login - missing credentials", async () => {
    const credentials = {};
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("status", "fail");
    expect(body).toHaveProperty("data.email", "Email and password are required.");
  });

  test("POST /login - email not found", async () => {
    const credentials = {
      email: "notfound@test.com",
      password: "test"
    };
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("status", "fail");
    expect(body).toHaveProperty("data.result", "Incorrect email or password");
  });

  test("GET /todos - success", async () => {
    const { body } = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data.todos");
  });

});
