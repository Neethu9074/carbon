/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

const deserializeErrorMessage = (error: string): string => {
  try {
    return JSON.parse(error.substring(error.indexOf('{'), error.indexOf('}') + 1)).errors[0];
  } catch {
    return error;
  }
};

export default deserializeErrorMessage;
