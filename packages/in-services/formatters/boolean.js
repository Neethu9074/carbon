/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/**
 * takes a value and return 'Yes', if the value is not falsy, 'No' otherwhise
 *
 * @param {value} the value to be checked for falsy
 * @returns {string} the 'Yes' if not falsy, 'No' otherwhise
 */
export function yesOrNo(value) {
  return value ? 'Yes' : 'No';
}

export function compare(b1, b2) {
  return b1 === b2 ? 0 : b1 ? -1 : 1;
}
