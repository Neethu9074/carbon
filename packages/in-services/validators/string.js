export function stringMaxLengthValidator(maxLength = 128) {
  return str => {
    if (typeof str === 'string' && str.length > maxLength) {
      return [
        {
          severity: 'error',
          message: `Value must be shorter than ${maxLength} characters.`
        }
      ];
    }
    return null;
  };
}
