import { isBlank } from 'in-services/util/string';

export function regularExpressionValidator(v) {
  if (v == null || isBlank(v)) {
    return null;
  }

  try {
    new RegExp(v);
    return null;
  } catch (e) {
    return [
      {
        severity: 'error',
        message: e.message
      }
    ];
  }
}
