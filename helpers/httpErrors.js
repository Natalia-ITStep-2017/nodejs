const messageList = {
  400: "Bad Request",
  404: "Not Found",
}

const httpError = (status, message = messageList[status]) => {
  console.log(status)
  const error = new Error(message);
  error.status = status;
  console.log(error.status)
  return error;
}

export default httpError;