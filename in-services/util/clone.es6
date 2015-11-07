
export default function clone(input) {
  const type = typeof input;
  if (input === null || input === undefined || typeof input !== 'object') {
    return input;
  }

  if (input.constructor === Array) {
    const result = [];

    for (let i = 0, n = input.length; i < n; i++) {
      result[i] = clone(input[i]);
    }

    return result;
  }

  if (type === 'object') {
    const result = {};

    for (const key in input) {
      if (input.hasOwnProperty(key)) {
        result[key] = clone(input[key]);
      }
    }

    return result;
  }

  return input;
}
