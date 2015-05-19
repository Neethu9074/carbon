'use strict';

/**
 * Iterates through all the problems and searches for the most important one.
 * Retuns a number [0, 10] which is the highest found severity
 * inside the problem.
 *
 * @param {collection} status - The collection, holding all problems
 * @returns {number} highest found severity
 */
export function getHealth(status) {
  let maxSeverity = 0;
  iterateTrough(status, (hardware) => {
    iterateTrough(hardware, (part) => {
      iterateTrough(part.get('problems'), (problem) =>{
        const severity = problem.get('severity');
        maxSeverity = severity > maxSeverity ? severity : maxSeverity;
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
