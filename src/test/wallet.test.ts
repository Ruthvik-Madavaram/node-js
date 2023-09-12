import { expect } from 'chai';
import { mock, SinonMock, stub } from 'sinon';
import { createWallet, getWallet } from '../controllers/wallet';
import Wallet from '../models/wallet';
import User from '../models/user';

describe('Wallet Controller', () => {
  describe('getWallet', () => {
    it('should return a user\'s wallets', async () => {
      const userId = 'user123';
      const userMock = {
        _id: userId,
      };
      const walletsMock = [
        {
          name: 'Wallet 1',
          balance: 100,
          cryptoCurrencyBalance: 50,
          userId,
        },
        {
          name: 'Wallet 2',
          balance: 200,
          cryptoCurrencyBalance: 75,
          userId,
        },
      ];

      const req: any = { userId };
      const res: any = {
        status: (statusCode: number) => ({
          json: (data: any) => {
            expect(statusCode).to.equal(200);
            expect(data.wallets).to.deep.equal(walletsMock);
          },
        }),
      };

      const UserFindByIdMock: SinonMock = mock(User);
      UserFindByIdMock.expects('findById').withArgs(userId).resolves(userMock);

      const WalletFindMock: SinonMock = mock(Wallet);
      WalletFindMock.expects('find').withArgs({ userId }).resolves(walletsMock);

      await getWallet(req, res, () => {});

      UserFindByIdMock.verify();
      WalletFindMock.verify();
      UserFindByIdMock.restore();
      WalletFindMock.restore();
    });

    it('should handle the case when the user is not found', async () => {
      const userId = 'user123';

      const req: any = { userId };
      const res: any = {
        status: (statusCode: number) => ({
          json: (data: any) => {
            expect(statusCode).to.equal(404);
            expect(data.message).to.equal('User not found');
          },
        }),
      };

      const UserFindByIdMock: SinonMock = mock(User);
      UserFindByIdMock.expects('findById').withArgs(userId).resolves(null);

      await getWallet(req, res, () => {});

      UserFindByIdMock.verify();
      UserFindByIdMock.restore();
    });

    it('should handle the case when there are no wallets for the user', async () => {
      const userId = 'user123';
      const userMock = {
        _id: userId,
      };

      const req: any = { userId };
      const res: any = {
        status: (statusCode: number) => ({
          json: (data: any) => {
            expect(statusCode).to.equal(404);
            expect(data.message).to.equal('There are no wallets for this user');
          },
        }),
      };

      const UserFindByIdMock: SinonMock = mock(User);
      UserFindByIdMock.expects('findById').withArgs(userId).resolves(userMock);

      const WalletFindMock: SinonMock = mock(Wallet);
      WalletFindMock.expects('find').withArgs({ userId }).resolves([]);

      await getWallet(req, res, () => {});

      UserFindByIdMock.verify();
      WalletFindMock.verify();
      UserFindByIdMock.restore();
      WalletFindMock.restore();
    });
  });

  describe('createWallet', () => {
    it('should create a new wallet', async () => {
        const userId = 'user123';
        const walletData = {
          name: 'New Wallet',
          balance: 1000,
        };
        const createdWalletMock = {
          _id: 'wallet123',
          userId,
          ...walletData,
        };
  
        const req: any = {
          userId,
          body: walletData,
        };
        const res: any = {
          status: (statusCode: number) => ({
            json: (data: any) => {
              expect(statusCode).to.equal(201);
              expect(data.message).to.equal('wallet created successfully!');
              expect(data.wallet).to.deep.equal(createdWalletMock);
            },
          }),
        };

  
        const walletSaveStub = stub(Wallet.prototype, 'save').resolves(createdWalletMock);
  
        await createWallet(req, res, () => {});
  
        expect(walletSaveStub.calledOnce).to.be.true;
  
        walletSaveStub.restore();
      });
  
      it('should handle validation errors', async () => {
        const userId = 'user123';
        const walletData = {
          balance: 1000,
        };
  
        const req: any = {
          userId,
          body: walletData,
        };
        const res: any = {
          status: (statusCode: number) => ({
            json: (data: any) => {
              expect(statusCode).to.equal(422);
              expect(data.message).to.equal('Validation failed.');
              expect(data.data).to.be.an('array').that.is.not.empty;
            },
          }),
        };
  
        await createWallet(req, res, () => {});
    });
  });
});
