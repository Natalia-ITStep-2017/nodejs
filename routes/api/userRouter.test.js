import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import { User } from '../../models/index.js'
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
    email: "tiqebigo@labworld.org",
    password: "examplepassword"
    }; 
    
    const {statusCode: registerStatusCode} = await request(app).post("/users/register/").send(creds);
    if (registerStatusCode === 201) {
    const {statusCode: notVerifiedStatusCode, body: notVerifiedBody} = await request(app).post("/users/login/").send(creds);
    expect(notVerifiedStatusCode).toBe(401);
    expect(notVerifiedBody.message).toBe('Your email is not verified');

    const {verificationToken} = await User.findOne({ email: creds.email });

    await request(app).get(`/users/verify/${verificationToken}`);
    }

    const {statusCode, body} = await request(app).post("/users/login/").send(creds);

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('token');
    expect(body.token.length).toBeGreaterThan(1);
    const {token} = await User.findOne({ email: creds.email });
    expect(body.token).toBe(token);
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