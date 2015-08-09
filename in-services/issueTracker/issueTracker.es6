/*eslint-disable new-cap*/



import Immutable from 'immutable';

import {create} from '../conveyer';
import {mapSeverityToHealth, health} from '../health';
import IssueConveyer from '../conveyer/IssueConveyer';
import {isIdEqual, getIdString, extractId} from '../util/snapshots';
import * as timelineStore from '../stores/timeline';

const allIssuesStream = timelineStore.timeframe.transform({
  emitLatestOnSubscribe: true,

  transform(timeframe) {
    return create(IssueConveyer, {timeframe})
      .scan(collectingReducer, Immutable.List());
  },

  shouldRetransform(previousTimeframe, nextTimeframe) {
    return previousTimeframe !== nextTimeframe;
  }
});

const openIssuesStream = allIssuesStream.map(issues => {
  return issues.filter(issue => issue.get('state') === 'OPEN');
});

const issueSummary = openIssuesStream.map(issues => {
  const warnings = {};
  const dangers = {};

  issues.forEach(issue => {
    let problem = issue.get('problem');
    const problemHealth = mapSeverityToHealth(problem.get('severity'));
    if (problemHealth === health.warning) {
      addProblem(warnings, problem);
    } else if (problemHealth === health.danger) {
      addProblem(dangers, problem);
    }
  });

  const iWarnings = Immutable.Map(
    Object.keys(warnings).reduce(severityReducer.bind(null, warnings), [])
  );

  const iDangers = Immutable.Map(
    Object.keys(dangers).reduce(severityReducer.bind(null, dangers), [])
  );

  return Immutable.Map([
    [health.warning, iWarnings],
    [health.danger, iDangers]
  ]);
});

function addProblem(all, problem) {
  const idString = getIdString(problem);
  if (!(idString in all)) {
    all[idString] = {
      id: extractId(problem),
      count: 1
    };
  } else {
    all[idString].count++;
  }
}

function severityReducer(all, severityArrayMap, key) {
  const item = all[key];
  severityArrayMap.push([item.id, item.count]);
  return severityArrayMap;
}


const issueCountSummary = issueSummary.map(summary => {
  return summary.map(summaryForHealth => {
    return summaryForHealth.reduce((count, snapshotIssueCount) => {
      return count + snapshotIssueCount;
    }, 0);
  });
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

export function getIssueCountSummary() {
  return issueCountSummary;
}

export function getProblemsForSnapshot(snapshot) {
  const predicate = isIdEqual.bind(null, snapshot);
  return openIssuesStream.map(issues => {
    let size = 0;
    const result = Immutable.List().asMutable();

    issues.forEach(issue => {
      let problem = issue.get('problem');
      if (predicate(problem)) {
        result.set(size++, problem);
      }
    });

    return result.asImmutable();
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
