import { getUserList, changeUserStatus } from '../controllers/UserManageController.js';
import express from 'express';

const UserManageRouter = express.Router();

// lấy danh sách user
UserManageRouter.get('/user-list', getUserList);
// thay đổi trạng thái user
UserManageRouter.put('/:userId/user-status', changeUserStatus);

export default UserManageRouter;