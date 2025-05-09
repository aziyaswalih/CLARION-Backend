import express from 'express';
import * as walletController from '../controllers/WalletController';

const router = express.Router();

router.get('/', walletController.getMyWallet);
// router.post('/add', walletController.addWalletBalance);
router.post('/donate', walletController.donateWithWallet);
router.post('/donateBlood',walletController.donateBlood);
export default router;
