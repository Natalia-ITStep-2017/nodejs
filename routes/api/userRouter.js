import { Router } from 'express'
import { userController } from "../../controllers/index.js"
import { validateBody } from '../../decorators/index.js';
import { userSchemas } from '../../schema/index.js'
import {authenticate, upload} from '../../middlewares/index.js';
 
const userRouter = Router();

userRouter.post('/register', validateBody(userSchemas.bodySchema), validateBody(userSchemas.userRegisterSchema), userController.register);

userRouter.get('/verify/:verificationToken',  userController.verify);

userRouter.post('/verify', validateBody(userSchemas.bodySchema), validateBody(userSchemas.bodyVerifySchema), userController.resendEmail);

userRouter.post('/login', validateBody(userSchemas.bodySchema), validateBody(userSchemas.userLoginSchema), userController.login);

userRouter.get('/current', authenticate, userController.getUser);

userRouter.post('/logout', authenticate, userController.logout);

userRouter.patch('/', authenticate, validateBody(userSchemas.bodySchema), validateBody(userSchemas.bodySubscriptionSchema), userController.updateUserStatus);

userRouter.patch('/avatars', authenticate,  upload.single("avatar"), userController.updateUserAvatar);

export default userRouter
