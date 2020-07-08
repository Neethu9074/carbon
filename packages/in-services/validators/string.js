export function stringMaxLengthValidator(maxLength = 128) {
  return str => {
    if (str.length > maxLength) {
      return [
        {
          severity: 'error',
          message: `Value must be shorted than ${maxLength} characters`
        }
      ];
    }
    return null;
  };
}
