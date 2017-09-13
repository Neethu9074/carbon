import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { evaluateClassNames } from 'in-services/util/classnames';
import { emptyMap } from 'in-services/fixedImmutables';

import './ComponentStatuses.less';

const block = 'in-kube-comp-status';

export default function ComponentStatuses({ snapshot }) {
  const statuses = snapshot.getIn(['data', 'componentStatuses'], emptyMap);

  if (statuses.size === 0) {
    return null;
  }

  return (
    <DashboardTile title="Component Statuses">
      <div className={block}>
        {statuses
          .sortBy((v, k) => k)
          .map((status, name) => <ComponentStatus snapshot={snapshot} name={name} status={status} key={name} />)
          .valueSeq()
          .toArray()}
      </div>
    </DashboardTile>
  );
}

function ComponentStatus({ name, status }) {
  return (
    <div className={`${block}__component`}>
      <div
        className={evaluateClassNames({
          [`${block}__status`]: true,
          [`${block}__status--healthy`]: status.get('Healthy') === 'True'
        })}
      />
      <div className={`${block}__name`}>{name}</div>
    </div>
  );
}
