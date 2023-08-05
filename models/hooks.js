export const handleSaveError = (error, data, next) => {
  if (error.code === 11000 && error.name === 'MongoServerError') {
    error.status = 409;
  } else {
    error.status = 400;
  }
  next();
}

export const handleUpdateValidate = function (next) {
  this.getOptions.runValidators = true;
  next();
}

export default {
  handleSaveError,
  handleUpdateValidate
}