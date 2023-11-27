/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

const deserializeErrorMessage = (error: string) => {
  const message: string = error;
  const stringObject = JSON.parse(message.substring(message.indexOf('{'), message.indexOf('}') + 1)).errors;
  return stringObject;
};

export default deserializeErrorMessage;
