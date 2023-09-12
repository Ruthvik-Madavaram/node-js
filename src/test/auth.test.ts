import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import { signup, login } from '../controllers/auth';
import User from '../models/user';

describe('Auth Controller', () => {
  describe('signup', () => {
    it('should return a 201 status code and user data on successful signup', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          userName: 'testuser',
          password: 'testpassword',
        },
      };

      const res = {
        status: (statusCode: number) => {
          expect(statusCode).to.equal(201);
          return {
            json: (data: any) => {
              expect(data.message).to.equal('User created!');
              expect(data).to.have.property('userId');
            },
          };
        },
      };

      const bcryptStub = sinon.stub(bcrypt, 'hash').resolves('hashedPassword');

      const saveStub = sinon.stub(User.prototype, 'save').resolves({ _id: 'mockUserId' });

      await signup(req as any, res as any, () => {});

      bcryptStub.restore();
      saveStub.restore();
    });

    it('should return a 500 status code and error on signup failure', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          userName: 'testuser',
          password: 'testpassword',
        },
      };

      const res = {
        status: (statusCode: number) => {
          expect(statusCode).to.equal(500);
          return {
            json: (data: any) => {
              expect(data).to.have.property('statusCode', 500);
              expect(data).to.have.property('message', 'Internal Server Error');
            },
          };
        },
      };

      const bcryptStub = sinon.stub(bcrypt, 'hash').rejects(new Error('Mock bcrypt error'));

      await signup(req as any, res as any, () => {});

      bcryptStub.restore();
    });
  });

  describe('login', () => {
    it('should return a token and user ID when valid login credentials are provided', async () => {
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(
        {
          _id: 'sampleUserId',
          email: 'test@example.com',
          password: 'hashedPassword',
        }
      );

      const req = {
        body: { email: 'test@example.com', password: 'password' },
      };
      const res = {
        status: (status: number) => {
          expect(status).to.equal(200);
          return res;
        },
        json: (data: any) => {
          expect(data).to.have.property('token');
          expect(data).to.have.property('userId', 'sampleUserId');
        },
      };

      await login(req as any, res as any, () => {});

      findOneStub.restore();
    });

    it('should return a 401 error when an incorrect password is provided', async () => {
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(
        {
          _id: 'sampleUserId',
          email: 'test@example.com',
          password: 'hashedPassword',
        }
      );

      const req = {
        body: { email: 'test@example.com', password: 'wrongPassword' },
      };
      const res = {
        status: (status: number) => {
          expect(status).to.equal(401);
          return res;
        },
      };

      await login(req as any, res as any, () => {});

      findOneStub.restore();
    });

    it('should return a 401 error when a user with the provided email does not exist', async () => {
      const findOneStub = sinon.stub(User, 'findOne');
      findOneStub.resolves(null);

      const req = {
        body: { email: 'nonexistent@example.com', password: 'password' },
      };
      const res = {
        status: (status: number) => {
          expect(status).to.equal(401);
          return res;
        },
      };

      await login(req as any, res as any, () => {});

      findOneStub.restore();
    });
  });
});
