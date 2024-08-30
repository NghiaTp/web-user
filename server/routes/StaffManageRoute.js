import { getStaffList, changeStaffStatus } from '../controllers/StaffManageController.js';
import express from 'express';

const StaffManageRouter = express.Router();

// lấy danh sách staff
StaffManageRouter.get('/staff-list', getStaffList);
// thay đổi trạng thái staff
StaffManageRouter.put('/:userId/staff-status', changeStaffStatus);

export default StaffManageRouter;