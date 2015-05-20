'use strict';


export const health = {
  ok: 'ok',
  warning: 'warning',
  danger: 'danger'
};

/**
 * Gets the max severity of all problems and maps them to a health string.
 *
 * @param {Immutable<Snapshot>} snapshot - the snapshot of a host
 * @returns {string} the mapped string for severity
 */
export function getHealth(snapshot) {
  const severity = getMaxSeverity(snapshot);
  if(severity > 8) {
    return health.danger;
  } else if(severity > 4) {
    return health.warning;
  }
  return health.ok;
}

/**
 * Iterates through all the problems and searches for the most important one.
 * Retuns a number [0, 10] which is the highest found severity
 * inside the problem.
 *
 * @param {Immutable<Snapshot>} snapshot - the snapshot of a host
 * @returns {number} highest found severity
 */
function getMaxSeverity(snapshot) {
  let maxSeverity = 0;
  iterateTrough(snapshot.getIn(['data', 'status']), (hardware) => {
    iterateTrough(hardware, (part) => {
      iterateTrough(part.get('problems'), (problem) =>{
        maxSeverity = Math.max(maxSeverity, problem.get('severity'));
      });
    });
  });
  return maxSeverity;
}

function iterateTrough(collection, fn) {
  if(collection === undefined || collection.size === 0) {
    return;
  }

  collection.forEach(item => fn(item));
}
