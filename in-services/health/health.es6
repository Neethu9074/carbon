import { theme } from '../theme';

export const health = {
  unknown: 'unknown',
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
  if (severity > 8) {
    return health.danger;
  } else if (severity > 4) {
    return health.warning;
  }
  return health.ok;
}

/**
 * Turns a health value into a color string (hex)
 *
 * @param {string} healthToMap A health to map
 * @returns {string} the mapped color string
 */
export function mapHealthToColor(healthToMap) {
  if (healthToMap === health.danger) {
    return theme.health[10];
  } else if (healthToMap === health.warning) {
    return theme.health[5];
  }
  return theme.health[0];
}
