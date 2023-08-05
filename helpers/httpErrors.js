const messageList = {
  400: "Bad Request",
  404: "Not Found",
  401: "Unauthorized"
}

const httpError = (status, message = messageList[status]) => {
  const error = new Error(message);
  error.status = status;
  return error;
}

export default httpError;