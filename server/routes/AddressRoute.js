import { Router } from 'express';
import { addAddress, deleteAddress, getUserAddress, updateAddress } from '../controllers/AddressController.js';
import authMiddleWare from '../middleware/auth.js';

const router = Router();

router.post('/add', authMiddleWare, addAddress);
router.get('/list', authMiddleWare, getUserAddress);
router.put('/update/:addressId', authMiddleWare, updateAddress);
router.delete('/:addressId', authMiddleWare, deleteAddress)
export default router;