export function formatBoolean(value) {
  let returnValue;
  if (value) {
    returnValue = 'Yes';
  } else {
    returnValue = 'No';
  }
  return returnValue;
}
