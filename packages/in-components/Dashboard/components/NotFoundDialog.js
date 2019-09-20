import React from 'react';

import EntityVersionListPresenter from 'in-new-components/EntityVersionList/EntityVersionListPresenter';
import CenterAlignmentColumn from 'in-components/layout/CenterAlignmentColumn';
import LoadingIndicator from 'in-components/LoadingIndicator';

export default function NotFoundDialog({ versionsForFocusedMoment, versionsForLive }) {
  if (!versionsForFocusedMoment && !versionsForLive) {
    return <LoadingIndicator type="dark" />;
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
