import { Router } from 'express'
import { contactController } from "../../controllers/index.js"
import { validateBody } from '../../decorators/index.js';
import schemas from '../../schema/schemas.js'
import isValidId from '../../models/isValidId.js';

const router = Router();

router.get('/', contactController.getAllContacts)

router.get('/:id', isValidId, contactController.getContactById)

router.post('/', validateBody(schemas.bodySchema), validateBody(schemas.contactSchema), contactController.addContact)

router.delete('/:id', isValidId, contactController.deleteContact)

router.put('/:id', isValidId, validateBody(schemas.bodySchema), validateBody(schemas.contactSchema), contactController.updateContact)

router.patch('/:id/favorite', isValidId, validateBody(schemas.bodyStatusSchema), contactController.updateStatusContact)

export default router
