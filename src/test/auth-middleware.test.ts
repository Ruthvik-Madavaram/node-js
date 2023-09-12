import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import isAuth from '../middleware/is-auth';

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function() {
        return null;
      }
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function() {
        return 'xyz';
      }
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function() {
    const req = {
      get: function() {
        return 'Bearer djfkalsdjfaslfjdlas';
      }
    };
    const jwtVerifyStub: any = sinon.stub(jwt, 'verify');
    jwtVerifyStub.returns({ userId: 'abc' });
    isAuth(req, {}, () => {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwtVerifyStub.called).to.be.true;
    jwtVerifyStub.restore();
  });

  it('should throw an error if the token cannot be verified', function() {
    const req = {
      get: function() {
        return 'Bearer xyz';
      }
    };
    expect(isAuth.bind(this, req, {}, () => {})).to.throw();
  });
});
