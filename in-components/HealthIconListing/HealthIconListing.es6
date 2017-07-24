import React from 'react';

import { getEventsViewFilteredByEntity } from 'in-stores/navigation/navigation';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { getColorBySeverity } from 'in-stores/events';
import EventListing from 'in-components/EventListing';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import './HealthIconListing.less';

const block = 'in-health-icon-listing';

export default connectTo(
  props => {
    if (props.healthInfo) {
      return {};
    }
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function HealthCounter({ healthInfo, snapshotId, className }) {
    if (!healthInfo) {
      return null;
    }

    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
    const color = maxSeverity > 0 ? getColorBySeverity(maxSeverity) : '#92A5AE';
    const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenEvents') : 0;

    let classes = block;
    if (className) {
      classes += ' ' + className;
    }

    const counter = (
      <Link href$={getEventsViewFilteredByEntity(snapshotId)} className={`${block}__link`}>
        <span
          className={classes}
          style={{
            color: maxSeverity < 6 ? '#172429' : '#fff',
            backgroundColor: color
          }}
        >
          {numberOfOpenIssues}
        </span>
      </Link>
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
