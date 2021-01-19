/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function composeAndShortCircuitOnError(...validators) {
  return value => {
    const result = [];

    for (const validator of validators) {
      let errorSeen = false;
      const validationMessages = validator(value) || [];

      for (const validationMessage of validationMessages) {
        result.push(validationMessage);
        errorSeen = errorSeen || validationMessage.severity === 'error';
      }

      if (errorSeen) {
        return result;
      }
    }

    return result;
  };
}

export function anyOf(...validators) {
  return value => {
    const result = [];

    for (const validator of validators) {
      let errorSeen = false;
      const validationMessages = validator(value) || [];

      for (const validationMessage of validationMessages) {
        result.push(validationMessage);
        errorSeen = errorSeen || validationMessage.severity === 'error';
      }

      if (errorSeen) {
        return result;
      }
    }

    return result;
  };
}
