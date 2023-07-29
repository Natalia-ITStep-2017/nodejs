import Joi from "joi";

const contactSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .min(2).max(50)
    .required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(5).max(20).required(),
  favorite:  Joi.boolean()
}).messages({
  'string.empty': '{#label} cant be empty!',
  'any.required': 'missing required {#label} field'
})

const bodySchema = Joi.object().min(1).rule({ message: 'missing fields' })

const bodyStatusSchema = Joi.object().keys({
  favorite:Joi.boolean().required()
}).messages({
  'any.required': 'missing field favorite'
});

export default {
  contactSchema,
  bodySchema,
  bodyStatusSchema
}