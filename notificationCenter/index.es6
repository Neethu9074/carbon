/*eslint-disable new-cap*/

'use strict';

import Immutable from 'immutable';

import {create} from '../conveyer';
import IssueConveyer from '../conveyer/IssueConveyer';
import {isIdEqual} from '../util/snapshots';

const allIssuesStream = create(IssueConveyer)
  .scan(collectingReducer, Immutable.List());

const openIssuesStream = allIssuesStream.map(issues => {
  return issues.filter(issue => issue.get('end') === null);
});

export function getIssues() {
  return allIssuesStream;
}

export function getOpenIssues() {
  return openIssuesStream;
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
