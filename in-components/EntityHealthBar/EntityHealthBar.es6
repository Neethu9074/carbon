import React from 'react';

import HealthIconListing from 'in-components/HealthIconListing';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import connectTo from 'in-hoc/connectTo';

import './EntityHealthBar.less';

const block = 'in-entity-health-bar';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function EntityHealthBar({ healthInfo, snapshotId }) {
    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
    const color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#92A5AE';

    return (
      <div className={block}>
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

        <HealthIconListing snapshotId={snapshotId} healthInfo={healthInfo} />
      </div>
    );
  }
);
