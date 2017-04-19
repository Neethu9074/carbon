import React from 'react';

import HealthIconListing from 'in-components/HealthIconListing';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';
import { getColorBySeverity } from 'in-stores/events';

import './SidebarHealthInfo.less';

const block = 'in-sidebar-health-info';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function SidebarHealthInfo({ healthInfo, snapshotId }) {
    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
    const color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#92A5AE';

    return (
      <div className={block}>
        Health

        <div className={`${block}__bar`}>
          <div
            className={`${block}__bar-inner`}
            style={{
              width: `${maxSeverity * 10}%`,
              background: color
            }}
          />
          <div className={`${block}__bar-shadow`} />
        </div>

        <HealthIconListing snapshotId={snapshotId} />
      </div>
    );
  }
);
