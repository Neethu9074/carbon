import { fromJS } from 'immutable';
import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { evaluateClassNames } from 'in-services/util/classnames';

import './ComponentStatuses.less';

const block = 'in-kube-comp-status';

export default function ComponentStatuses({ snapshot }) {
  const statuses = fromJS({
    scheduler: {
      Healthy: 'True',
      message: 'ok'
    },
    'controller-manager': {
      Healthy: 'True',
      message: 'ok'
    },
    'etcd-1': {
      Healthy: 'True',
      message: '{"health": "true"}'
    },
    'etcd-0': {
      Healthy: 'True',
      message: '{"health": "true"}'
    }
  });

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
