/* eslint-disable new-cap */
import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import {getIssues as getIssueStore} from 'in-stores/issues';
import {isDemoEnvironment} from 'in-services/config';
import * as settings from 'in-services/settings';
import {theme} from 'in-services/theme';

import {mapSeverityToHealth, health} from '../health';
import * as timelineStore from '../stores/timeline';

// CPU steal issues shouldn't be shown in the demo environment as we are using
// small EC2 instances. These almost always have high CPU steal.
const withoutCpuStealMapper = (issues) => {
  return issues.filter(issue =>
    issue.getIn(['problem', 'problemText'], '').indexOf('Steal') === -1
  );
};

const allIssuesStreamWithExperimentals = timelineStore.timeframe.distinct()
  .flatMap(timeframe => {
    const stream = getIssueStore(timeframe).scan(collectingReducer, Immutable.List());

    if (isDemoEnvironment()) {
      return stream.map(withoutCpuStealMapper);
    }

    return stream;
  });

const allIssuesStream = combineLatest(
  [settings.getIn(['experiments']), allIssuesStreamWithExperimentals]
).map(([withExperiments, issues]) => {
  if (withExperiments) {
    return issues;
  }
  return issues.filter(issue => !issue.getIn(['problem', 'experimental'], false));
});

const openIssuesStream = allIssuesStream.map(issues => issues.filter(issue => !issue.get('end')));

const issueSummary = openIssuesStream.map(issues => {
  const warnings = {};
  const dangers = {};

  issues.forEach(issue => {
    const problem = issue.get('problem');
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
  const id = problem.get('snapshotId');
  if (!(id in all)) {
    all[id] = {
      id,
      count: 1
    };
  } else {
    all[id].count++;
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

export function getIssuesById(snapshotId) {
  return openIssuesStream.map(issues => {
    let size = 0;
    const result = Immutable.List().asMutable();

    issues.forEach(issue => {
      if (issue.getIn(['problem', 'snapshotId']) === snapshotId) {
        result.set(size++, issue);
      }
    });

    return result.asImmutable();
  });
}

export function getProblemsById(snapshotId) {
  return getIssuesById(snapshotId).map(issues => issues.map(issue => issue.get('problem')));
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
export function getHealth(snapshotId) {
  return getProblemsById(snapshotId)
    .map(problems => {
      return problems.reduce((acc, problem) => {
        return Math.max(problem.get('severity'), acc);
      }, 0);
    })
    .map(mapSeverityToHealth)
    .distinct();
}

/**
 * Gets the color for an issue. If an issue is closed it should be some kind
 * grey, if it's open and critical it has a danger color and so on.
 *
 * @param {Immutable<Issue>} Issue The issue for which the color should be determined.
 * @returns {string} The color string in hex (e.g. #F03249)
 */
export function getColorForIssue(issue) {
  throwExceptionIfUndefined(issue);

  // if there is no end time, the issue is open
  return !issue.get('end') ? getColorForProblem(issue.get('problem')) : theme.health[0];
}

export function getColorForProblem(problem) {
  const severity = problem.get('severity');
  throwExceptionIfUndefined(severity);
  return theme.health[severity];
}

function throwExceptionIfUndefined(property) {
  if (property === undefined) {
    throw new Error('Missing argument:', property);
  }
}
