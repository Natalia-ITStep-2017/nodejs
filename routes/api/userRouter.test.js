import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import "dotenv/config";

const {DB_HOST_TEST, PORT} = process.env;

describe ('test login route', () => {
  let server = null;
  beforeAll ( async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  })

  afterAll (async () => {
    await mongoose.connection.close();
    server.close();
  })

  test ('test login with correct data ', async() => {
const creds ={
    email: "avatarexample@example.com",
    password: "examplepassword"
    }; 
    
    await request(app).post("/users/register/").send(creds);

    const {statusCode, body} = await request(app).post("/users/login/").send(creds);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body.token.length).toBeGreaterThan(1);
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('email');
    expect(body.user.email).toEqual(expect.any(String));
    expect(body.user.email).toBe(creds.email);
    expect(body.user).toHaveProperty("subscription");
    expect(body.user.subscription).toEqual(expect.any(String));
    expect(body.user).toHaveProperty("avatarURL");
    expect(body.user.avatarURL).toEqual(expect.any(String));
  })
})