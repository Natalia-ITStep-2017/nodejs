import { Router } from 'express'
import { userController } from "../../controllers/index.js"
import { validateBody } from '../../decorators/index.js';
import { userSchemas } from '../../schema/index.js'
import {authenticate} from '../../middlewares/index.js';

const userRouter = Router();

userRouter.post('/register', validateBody(userSchemas.bodySchema), validateBody(userSchemas.userRegisterSchema), userController.register);

userRouter.post('/login', validateBody(userSchemas.bodySchema), validateBody(userSchemas.userLoginSchema), userController.login);

userRouter.get('/current', authenticate, userController.getUser);

userRouter.post('/logout', authenticate, userController.logout);

userRouter.patch('/', authenticate, validateBody(userSchemas.bodySchema), validateBody(userSchemas.bodySubscriptionSchema), userController.updateUserStatus);

export default userRouter
