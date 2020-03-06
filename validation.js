const Joi = require("@hapi/joi")

function registerValidation(data) {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required()
  })

  return schema.validate(data)
}

function loginValidation(data) {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string().required()
  })

  return schema.validate(data)
}

module.exports = {
  registerValidation,
  loginValidation
}
