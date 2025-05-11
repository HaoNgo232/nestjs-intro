import { faker } from '@faker-js/faker';

export const compleUser = {
  username: faker.person.firstName(),
  email: faker.internet.email(),
  password: '123',
};

export const missingUserName = {
  email: faker.internet.email(),
  password: '123',
};

export const missingEmail = {
  username: faker.person.firstName(),
  password: '123',
};

export const missingPassword = {
  username: faker.person.firstName(),
  email: faker.internet.email(),
};
