import React from 'react';

import EntityVersionListPresenter from 'in-new-components/EntityVersionList/EntityVersionListPresenter';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import { getSnapshotVersions } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import locals from './EntityVersionList.mless';

export default connectTo(
  ({ snapshotId, timeConfig }) => ({
    versionsForFocusedMoment: getSnapshotVersions(snapshotId, timeConfig).startWith(null),
    versionsForLive: getSnapshotVersions(snapshotId, getTimeConfigAtMoment(null)).startWith(null)
  }),
  function EntityVersionList({ errors, plugin, versionsForFocusedMoment, versionsForLive }) {
    const hasRbacErrors = errors && errors[0].code === 'AUTH';
    if (
      hasRbacErrors ||
      (versionsForFocusedMoment && versionsForFocusedMoment.size === 0 && versionsForLive && versionsForLive.size === 0)
    ) {
      return <ErroneousResultPresenter errors={errors} className={locals.error} />;
    }

    const snapshotVersions = mergeVersionLists(versionsForFocusedMoment, versionsForLive);

    return (
      <div className={locals.wrapper}>
        <EntityVersionListPresenter plugin={plugin} snapshotVersions={snapshotVersions} />
      </div>
    );
  }
);

function mergeVersionLists(listA, listB) {
  const items = new Map();

  if (listA) {
    listA.forEach(add);
  }
  if (listB) {
    listB.forEach(add);
  }

  const result = [];
  const values = items.values();
  for (const value of values) {
    result.push(value);
  }
  return result;

  function add(version) {
    const from = version.get('from');
    const to = version.get('to');
    const id = `${from}:${to}`;

    if (!items.has(id)) {
      items.set(id, { from, to });
    }
  }
}
