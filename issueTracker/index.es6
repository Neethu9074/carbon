/*eslint-disable new-cap*/

'use strict';

import Immutable from 'immutable';

import {create} from '../conveyer';
import {mapSeverityToHealth, health} from '../health';
import IssueConveyer from '../conveyer/IssueConveyer';
import {isIdEqual} from '../util/snapshots';

const allIssuesStream = create(IssueConveyer)
  .scan(collectingReducer, Immutable.List());

const openIssuesStream = allIssuesStream.map(issues => {
  return issues.filter(issue => issue.get('end') === null);
});

const issueSummary = openIssuesStream.map(issues => {
  const result = {};

  Object.keys(health).forEach(key => {
    result[health[key]] = 0;
  });

  issues.forEach(issue => {
    const maxSeverity = issue.get('problems').reduce((severity, problem) => {
      return Math.max(severity, problem.get('severity'));
    }, 0);

    result[mapSeverityToHealth(maxSeverity)]++;
  });

  return Immutable.Map(result);
});

export function getIssues() {
  return allIssuesStream;
}

export function getOpenIssues() {
  return openIssuesStream;
}

export function getIssueSummary() {
  return issueSummary;
}

export function getProblemsForSnapshot(snapshotId) {
  const predicate = isIdEqual.bind(null, snapshotId);

  return openIssuesStream.map(issues => {
    return issues.reduce((problemsForSnapshot, issue) => {
      return problemsForSnapshot.concat(
        issue.get('problems').filter(predicate)
      );
    }, Immutable.List());
  });
}

function collectingReducer(existingIssues, issueUpdates) {
  // a issue may already exist in our list of issues.
  // We assume that it is an update in such cases. An update may change a
  // problem's end time and other properties.
  //
  // Remove all issues for which we get updates from the backend
  // and add the updated ones.
  return existingIssues.filter(existingIssue => {
    return issueUpdates.findIndex(updatedIssue => {
      return updatedIssue.get('id') === existingIssue.get('id');
    }) === -1;
  })
  .concat(issueUpdates);
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
