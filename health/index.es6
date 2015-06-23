'use strict';

import {getProblemsForSnapshot} from '../issueTracker';

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

/**
 * Gets the max severity of all problems and maps them to a health string. This
 * works by subscribing to all problems that occured for this snapshot and
 * returning a reactive observable.
 *
 * @param {Immutable<Snapshot>} snapshot The snapshot for which the health
 *   should be determined.
 * @returns {ReactiveObservable<string>} A stream that emits whenever the health
 *   changes.
 */
export function getHealth(snapshot) {
  return getProblemsForSnapshot(snapshot)
    .map(problems => {
      return problems.reduce((acc, problem) => {
        return Math.max(problem.get('severity'), acc);
      }, 0);
    })
    .map(mapSeverityToHealth)
    .distinct();
}
