/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function buildEnumValidator(allowedValues) {
  const sortedAllowedValues = allowedValues.slice().sort();

  return v => {
    // Do not check for required – deliberate triple eq check!
    if (v === undefined) {
      return;
    }

    if (allowedValues.indexOf(v) === -1) {
      return [
        {
          severity: 'error',
          message: `Value '${v}' is not one of the supported values. Expected one of: ${sortedAllowedValues.join(', ')}`
        }
      ];
    }
  };
}
