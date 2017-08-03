import React from 'react';

import EntityHealthBar from 'in-components/EntityHealthBar';

import './EntityHealthInfo.less';

const block = 'in-entity-health-info';

export default function EntityHealthInfo({ snapshotId }) {
  return (
    <div className={block}>
      <span className={`${block}__title`}>
        Health
      </span>
      <EntityHealthBar snapshotId={snapshotId} className={`${block}__health-bar`} />
    </div>
  );
}
