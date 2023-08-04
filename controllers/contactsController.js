
import Contact from '../models/contact.js'
import { httpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js"

const getAllContacts = async (req, res) => {
  const {_id: owner} = req.user;
 
  const {page = 1, limit = 10, ...query} = req.query;
  const skip = (page - 1 )* limit;

  const totalContact = await Contact.find({owner, ...query}).count();

  const result = await Contact.find({owner, ...query}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "email");
  res.json({
    contact:result,
    totalContact
   })
}

const getContactById = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.findOne({owner, _id:req.params.id});
  if (!result) {
    throw httpError(404);
  }
  res.json(result)
}

const addContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.create({...req.body, owner})
  res.status(201).json(result)
}

const deleteContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.findOneAndRemove({owner, _id:req.params.id})
  if (!result) {
    throw httpError(404);
  }
  res.json({ message: 'contact deleted' })
}

const updateContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.findOneAndUpdate({owner, _id:req.params.id}, req.body, {new:true});
  if (!result) {
    throw httpError(404);
  }
  res.json(result);
}

const updateStatusContact  = async (req, res) => {
  const {_id: owner} = req.user;
    const result = await Contact.findOneAndUpdate({owner, _id:req.params.id}, req.body, {new:true});
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
