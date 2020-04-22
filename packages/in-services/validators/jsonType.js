// These validators can be used for features such as "Edit as JSON"
// to validate that specific types be used.

export const objectValidator = createPrototypeCheck(Object.prototype);
export const arrayValidator = createPrototypeCheck(Array.prototype);
export const booleanValidator = createPrototypeCheck(Boolean.prototype);
export const stringValidator = createPrototypeCheck(String.prototype);
export const numberValidator = createPrototypeCheck(Number.prototype, num => {
  if (isNaN(num)) {
    return [
      {
        severity: 'error',
        message: `The provided number is invalid.`
      }
    ];
  }
});

function createPrototypeCheck(expectedPrototype, validateTypeDetails) {
  const expectedPrototypeLabel = expectedPrototype.constructor?.name;

  return v => {
    // Do not check for required – deliberate triple eq check!
    if (v === undefined) {
      return;
    }

    // null does not have a prototype, i.e. we have to treat it in a special way.
    if (v === null) {
      return [
        {
          severity: 'error',
          message: getErrorMessage(expectedPrototypeLabel, 'null')
        }
      ];
    }

    const actualPrototype = Object.getPrototypeOf(v);
    if (actualPrototype !== expectedPrototype) {
      const actualPrototypeLabel = actualPrototype.constructor?.name;
      return [
        {
          severity: 'error',
          message: getErrorMessage(expectedPrototypeLabel, actualPrototypeLabel)
        }
      ];
    }

    if (validateTypeDetails) {
      return validateTypeDetails(v);
    }
  };
}

// Exposed for testing purposes
export function getErrorMessage(expectedType, actualType) {
  const message = `A value of type '${expectedType}' is required.`;
  if (!actualType) {
    return message;
  }
  return `${message} Got '${actualType}'.`;
}
