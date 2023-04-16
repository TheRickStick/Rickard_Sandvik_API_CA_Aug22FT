const express = require("express");
const request = require("supertest");
const app = express();
require('dotenv').config()
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/todo", todoRoutes);

describe("testing-todo-routes", () => {
  let token;

  test("POST /login - success", async () => {
    const credentials = {
        email: "johndoe@example.com",
        password: "password123"
    }
    const { body } = await request(app).post("/login").send(credentials);
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("token");
    token = body.data.token;
    console.log(token);
  });

  test("GET /todo - success", async () => {
    const body  = await request(app).get("/todo").set("Authorization", `Bearer ${token}`);
    console.log(body);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data).toBeInstanceOf(Array);
  });

  test("POST /todo - success", async () => {
    const todo = {
      title: "Test Todo",
      description: "Test description",
      completed: false
    };
    const body  = await request(app).post("/todo").set("Authorization", `Bearer ${token}`).send(todo);
    console.log(body);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("_id");
  });

  test("DELETE /todo/:id - success", async () => {
    const todo = {
      title: "Test Todo",
      description: "Test description",
      completed: false
    };
    const { body: { data } } = await request(app).post("/todo").set("Authorization", `Bearer ${token}`).send(todo);
    const body  = await request(app).delete(`/todo/${data._id}`).set("Authorization", `Bearer ${token}`);
    console.log(body);
    expect(body).toHaveProperty("status", "success");
    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("_id", data._id);
  });

  test("GET /todo - error without token", async () => {
    const body  = await request(app).get("/todo");
    console.log(body);
    expect(body).toHaveProperty("status", "error");
    expect(body).toHaveProperty("message", "Authentication failed");
  });

  test("GET /todo - error with invalid token", async () => {
    const body  = await request(app).get("/todo").set("Authorization", `Bearer invalid-token`);
    console.log(body);
    expect(body).toHaveProperty("status", "error");
    expect(body).toHaveProperty("message", "Authentication failed");
  });

});


