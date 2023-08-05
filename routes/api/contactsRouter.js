import { Router } from 'express'
import { contactController } from "../../controllers/index.js"
import { validateBody } from '../../decorators/index.js';
import { contactSchemas } from '../../schema/index.js'
import { isValidId , authenticate} from '../../middlewares/index.js';

const router = Router();


router.use(authenticate);

router.get('/',  contactController.getAllContacts)

router.get('/:id', isValidId, contactController.getContactById)

router.post('/', validateBody(contactSchemas.bodySchema), validateBody(contactSchemas.contactSchema), contactController.addContact)

router.delete('/:id', isValidId, contactController.deleteContact)

router.put('/:id', isValidId, validateBody(contactSchemas.bodySchema), validateBody(contactSchemas.contactSchema), contactController.updateContact)

router.patch('/:id/favorite', isValidId, validateBody(contactSchemas.bodyStatusSchema), contactController.updateStatusContact)

export default router
