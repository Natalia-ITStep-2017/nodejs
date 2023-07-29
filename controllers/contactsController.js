
import Contact from '../models/contact.js'
import { httpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js"

const getAllContacts = async (_, res) => {
  const result = await Contact.find({});
  res.json(result)
}

const getContactById = async (req, res) => {
  const result = await Contact.findById(req.params.id);
  if (!result) {
    throw httpError(404);
  }
  res.json(result)
}

const addContact = async (req, res) => {
  const result = await Contact.create(req.body)
  res.status(201).json(result)
}

const deleteContact = async (req, res) => {
  const result = await Contact.findByIdAndRemove(req.params.id)
  if (!result) {
    throw httpError(404);
  }
  res.json({ message: 'contact deleted' })
}

const updateContact = async (req, res) => {
  console.log("request:", req.params.id, req.body);
  const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
  if (!result) {
    throw httpError(404);
  }
  res.json(result);
}

const updateStatusContact  = async (req,res) => {
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, {new:true});
    console.log("result:", result);  
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
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact:ctrlWrapper(updateStatusContact)
}
