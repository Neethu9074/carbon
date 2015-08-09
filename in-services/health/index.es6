

export const health = {
  ok: 'ok',
  warning: 'warning',
  danger: 'danger'
};

/**
 * Turn a severity value into a health
 *
 * @param {number} severity A severity as retrieved by a problem
 * @returns {string} the mapped severity
 */
export function mapSeverityToHealth(severity) {
  if(severity > 8) {
    return health.danger;
  } else if(severity > 4) {
    return health.warning;
  }
  return health.ok;
}
