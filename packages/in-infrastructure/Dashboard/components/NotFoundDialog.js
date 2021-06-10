/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityVersionListPresenter from 'in-components/EntityVersionList/EntityVersionListPresenter';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';

export default function NotFoundDialog({ versionsForFocusedMoment, versionsForLive }) {
  if (!versionsForFocusedMoment && !versionsForLive) {
    return <LoadingIndicator />;
  }

  const list = mergeVersionLists(versionsForFocusedMoment, versionsForLive).reverse();

  return (
    <CenterAlignmentColumn>
      <EntityVersionListPresenter versions={list} />
    </CenterAlignmentColumn>
  );
}

function mergeVersionLists(listA, listB) {
  const result = [];
  const alreadyAdded = {};

  if (listA) {
    listA.forEach(add);
  }
  if (listB) {
    listB.forEach(add);
  }

  return result;

  function add(version) {
    const from = version.get('from');
    const to = version.get('to');
    const id = `${from}:${to}`;

    if (!alreadyAdded[id]) {
      alreadyAdded[id] = true;
      result.push({ from, to });
    }
  }
}
