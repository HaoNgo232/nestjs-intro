/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { dropDatabase } from '../helpers/drop-database.helper';
import { bootstrapNestApplication } from '../helpers/bootstrap-nest-application.helper';
import {
  compleUser,
  missingEmail,
  missingPassword,
  missingUserName,
} from './user.post.e2e-spec.sample-data';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;

  beforeEach(async () => {
    // Initialize the application
    app = await bootstrapNestApplication();
    // Extract the config
    config = app.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/users - Endpoint is public', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer).post('/users').send(compleUser).expect(201);
  });
  it('/users - username is required', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer).post('/users').send(missingUserName).expect(400);
  });
  it('/users - email is required', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - password is required', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer).post('/users').send(missingPassword).expect(400);
  });
  it('/users - Valid request successfully creates user', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer)
      .post('/users')
      .send(compleUser)
      .expect(201)
      .then(({ body }) => {
        console.log('body', body);
        expect(body.data).toBeDefined();
        expect(body.data.username).toBe(compleUser.username);
        expect(body.data.email).toBe(compleUser.email);
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - password is not returned in response', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer)
      .post('/users')
      .send(compleUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });
  it('/users - googleId is not returned in response', () => {
    const httpServer = app.getHttpServer();
    return request(httpServer)
      .post('/users')
      .send(compleUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
