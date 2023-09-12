import { expect } from 'chai';
import { Response } from 'express';
import sinon, { SinonStub } from 'sinon';
import { buyCrypto, sellCrypto } from '../controllers/transaction'; // Import your controllers here
import Transaction from '../models/transaction';
import Wallet, { IWallet } from '../models/wallet';
import User, { IUser } from '../models/user';
import Crypto, { ICrypto } from '../models/crypto';
import { ProjectionType, Query } from 'mongoose';

describe('Transaction Controllers', () => {
  describe('buyCrypto', () => {
    let userFindStub: sinon.SinonStub<[id: any, projection?: ProjectionType<IUser> | null | undefined], Query<unknown, unknown, {}, IUser, "findOne">>;
    let cryptoStub: sinon.SinonStub<[id: any, projection?: ProjectionType<ICrypto> | null | undefined], Query<unknown, unknown, {}, ICrypto, "findOne">>;
    let walletStub: sinon.SinonStub<[id: any, projection?: ProjectionType<IWallet> | null | undefined], Query<unknown, unknown, {}, IWallet, "findOne">>;
    let transactionSaveStub: sinon.SinonStub<any[], any> | sinon.SinonStub<unknown[], unknown>;
    before(() => {
        userFindStub = sinon.stub(User, 'findById');
        cryptoStub = sinon.stub(Crypto, 'findById');
        walletStub = sinon.stub(Wallet, 'findById');
        transactionSaveStub = sinon.stub(Transaction.prototype, 'save');
    });
    after(() => {
        userFindStub.restore();
        cryptoStub.restore();
        walletStub.restore();
        transactionSaveStub.restore();
    });
    it('should create a new buy transaction', async () => {
        const req: any = {
          body: {
            quantity: 5,
            walletId: 'mockWalletId',
            cryptoId: 'mockCryptoId',
          },
          userId: 'mockUserId',
        };

        userFindStub.resolves({
            _id: 'mockUserId'
        });
  
        cryptoStub.withArgs('mockCryptoId').resolves({
          price: 100,
        } as any);
  
        walletStub.withArgs('mockWalletId').resolves({
          balance: 1000,
          cryptoCurrencyBalance: 0,
          save: sinon.stub(),
        } as any);
  
        transactionSaveStub.resolves({
          _id: 'mockTransactionId',
        } as any);
  
        const res: any = {
            statusCode: 500,
            status: function(code: any) {
                this.statusCode = code;
                return this;
              }
        };
  
        await buyCrypto(req, res, () => {});
  
        expect(res.statusCode).to.be.equal(201);
      });
  });

  describe('sellCrypto', () => {
    let saveStub: sinon.SinonStub<any[], any> | sinon.SinonStub<unknown[], unknown>;
    let walletSaveStub: sinon.SinonStub<any[], any> | sinon.SinonStub<unknown[], unknown>;
    let walletStub: sinon.SinonStub<[id: any, projection?: ProjectionType<IWallet> | null | undefined], Query<unknown, unknown, {}, IWallet, "findOne">>;
    let userFindStub: sinon.SinonStub<[id: any, projection?: ProjectionType<IUser> | null | undefined], Query<unknown, unknown, {}, IUser, "findOne">>;
    let cryptoStub: sinon.SinonStub<[id: any, projection?: ProjectionType<ICrypto> | null | undefined], Query<unknown, unknown, {}, ICrypto, "findOne">>;

    before(() => {
        userFindStub = sinon.stub(User, 'findById');
        cryptoStub = sinon.stub(Crypto, 'findById');
        saveStub = sinon.stub(Transaction.prototype, 'save');
        walletStub = sinon.stub(Wallet, 'findById');
        walletSaveStub = sinon.stub(Wallet.prototype, 'save');
    });
    after(() => {
        userFindStub.restore();
        cryptoStub.restore();
        saveStub.restore();
        walletStub.restore();
        walletSaveStub.restore();
    });

    it('should create a new transaction and update wallet balance', async () => {
      const req: any = {
        body: {
          quantity: 2,
          walletId: 'wallet_id',
          cryptoId: 'crypto_id',
        },
        userId: 'user_id',
      };

      userFindStub.resolves({ _id: 'user_id' });
      cryptoStub.resolves({ price: 100 });
      walletStub.withArgs('wallet_id').resolves({
        balance: 1000,
        cryptoCurrencyBalance: 10000,
        save: sinon.stub(),
      } as any);
      walletSaveStub.resolves({});
      saveStub.resolves({});

      const res: any = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);

      await sellCrypto(req, res, sinon.stub());

      expect(res.status.calledWith(201)).to.be.true;
    //   expect(res.json.calledOnce).to.be.true;
    //   expect(saveStub.calledOnce).to.be.true;
    //   expect(walletSaveStub.calledOnce).to.be.true;
    });
  });
});
