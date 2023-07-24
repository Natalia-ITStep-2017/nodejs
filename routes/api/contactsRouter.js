import { Router } from 'express'
import { contactController } from "../../controllers/index.js"
import { validateBody } from '../../decorators/index.js';
import schemas from '../../schema/schemas.js'


const router = Router();

router.get('/', contactController.getAllContacts)

router.get('/:id', contactController.getContactById)

router.post('/', validateBody(schemas.bodySchema), validateBody(schemas.contactSchema), contactController.addContact)

router.delete('/:id', contactController.deleteContact)

router.put('/:id', validateBody(schemas.bodySchema), validateBody(schemas.contactSchema), contactController.updateContact)

export default router
