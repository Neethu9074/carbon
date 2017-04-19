import React from 'react';

import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import EventListing from 'in-components/EventListing';
import HealthBar from 'in-components/HealthBar';
import Tooltip from 'in-components/Tooltip';
import { theme } from 'in-services/theme';
import connectTo from 'in-hoc/connectTo';

import './AnnotatedHealthBar.less';

const block = 'in-annotated-health-bar';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function AnnotatedHealthBar({ snapshotId, healthInfo, className }) {
    if (!healthInfo) {
      return null;
    }

    const maxSeverity = healthInfo.get('maxSeverity');
    const color = theme.health[Math.floor(maxSeverity)];
    const numberOfOpenIssues = healthInfo.get('numberOfOpenIssues');

    let classes = block;
    if (className) {
      classes += ' ' + className;
    }

    return (
      <div className={classes}>
        <HealthBar snapshotId={snapshotId} />

        {numberOfOpenIssues > 0
          ? <Tooltip content={<EventListing snapshotId={snapshotId} />}>
              <span
                className={block + '__counter'}
                style={{
                  color: maxSeverity < 6 ? '#000' : '#fff',
                  backgroundColor: color
                }}
              >
                {numberOfOpenIssues}
              </span>
            </Tooltip>
          : null}
      </div>
    );
  }
);
