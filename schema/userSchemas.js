import Joi from "joi";

import {emailRegexp, subscriptionList} from '../constants/userConstants.js'

const userRegisterSchema = Joi.object().keys({
  password: Joi.string()
    .min(6).max(15)
    .required(),
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string().valid(...subscriptionList)
}).messages({
  'string.empty': '{#label} cant be empty!',
  'any.required': 'missing required {#label} field'
})

const userLoginSchema = Joi.object().keys({
  password: Joi.string()
    .required(),
  email: Joi.string().required()
}).messages({
  'string.empty': '{#label} cant be empty!',
  'any.required': 'missing required {#label} field'
})

const bodySchema = Joi.object().min(1).rule({ message: 'missing fields' })

const bodySubscriptionSchema = Joi.object().keys({
  subscription: Joi.string().valid(...subscriptionList).required()
}).messages({
  'any.required': 'missing field subscription'
});

export default {
  userRegisterSchema,
  userLoginSchema,
  bodySchema,
  bodySubscriptionSchema
}
