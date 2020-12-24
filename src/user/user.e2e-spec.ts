import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../ormconfig';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserModule } from './user.module';

describe('User', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UserModule, TypeOrmModule.forRoot(ormConfig)],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    userRepository = module.get('UserRepository');
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      // Pre-populate the DB with some dummy users
      await userRepository.save([
        { name: 'test-name-0' },
        { name: 'test-name-1' },
      ]);

      // Run your end-to-end test
      return request(app.getHttpServer())
        .get('/users')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual([
            { id: expect.any(Number), name: 'test-name-0' },
            { id: expect.any(Number), name: 'test-name-1' },
          ]);
        });
    });
  });

  afterEach(async () => {
    await userRepository.query(`DELETE FROM users;`);
  });

  afterAll(async () => {
    await app.close();
  });
});
