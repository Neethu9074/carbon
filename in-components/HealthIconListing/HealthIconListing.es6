import React from 'react';

import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import EventListing from 'in-components/EventListing';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { theme } from 'in-services/theme';

import './HealthIconListing.less';

export default connectTo(
  props => {
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function HealthCounter({ healthInfo, snapshotId, className }) {
    if (!healthInfo) {
      return null;
    }

    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
    const color = maxSeverity > 0 ? theme.health[Math.floor(maxSeverity)] : '#92A5AE';
    const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenIssues') : 0;

    let classes = 'in-health-icon-listing';
    if (className) {
      classes += ' ' + className;
    }

    const counter = (
      <span
        className={classes}
        style={{
          color: maxSeverity < 6 ? '#172429' : '#fff',
          backgroundColor: color
        }}
      >
        {numberOfOpenIssues}
      </span>
    );

    if (numberOfOpenIssues > 0) {
      return (
        <Tooltip content={<EventListing snapshotId={snapshotId} />}>
          {counter}
        </Tooltip>
      );
    }

    return counter;
  }
);
