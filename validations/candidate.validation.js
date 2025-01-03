const Joi = require('joi');

const interviewUrl = {
  params: Joi.object().keys({
    shortId: Joi.string().required(),
  }),
};

module.exports = {
    interviewUrl,
}