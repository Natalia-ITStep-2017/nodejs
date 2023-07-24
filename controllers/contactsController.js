
import contactService from '../models/contacts.js'
import { httpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js"

const getAllContacts = async (_, res) => {
  const result = await contactService.listContacts();
  res.json(result)
}

const getContactById = async (req, res, next) => {
  const result = await contactService.getContactById(req.params.id);
  if (!result) {
    throw httpError(404);
  }
  res.json(result)
}

const addContact = async (req, res) => {
  const result = await contactService.addContact(req.body)
  res.status(201).json(result)
}

const deleteContact = async (req, res) => {
  const result = await contactService.removeContact(req.params.id)
  if (!result) {
    throw httpError(404);
  }
  res.json({ message: 'contact deleted' })
}

const updateContact = async (req, res) => {
  const result = await contactService.updateContact(req.params.id, req.body);
  if (!result) {
    throw httpError(404);
  }
  res.json(result);
}

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact)
}
