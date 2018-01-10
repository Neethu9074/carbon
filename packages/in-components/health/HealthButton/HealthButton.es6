import React from 'react';

import { getEventsViewFilteredByEntity } from 'in-stores/navigation/paths/eventPaths';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import EventListing from 'in-components/EventListing';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    if (props.healthInfo) {
      return {
        href: getEventsViewFilteredByEntity(props.snapshotId)
      };
    }
    return {
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId),
      href: getEventsViewFilteredByEntity(props.snapshotId)
    };
  },
  function HealthButton({ healthInfo, href, className, snapshotId, size }) {
    if (!healthInfo) {
      return null;
    }

    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;
    let kind = 'secondary';
    if (maxSeverity > 5) {
      kind = 'danger';
    } else if (maxSeverity > 0) {
      kind = 'warning';
    }
    const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenEvents') : 0;

    const counter = (
      <Button href={href} className={className} kind={kind} size={size}>
        {numberOfOpenIssues === 1 ? '1 open issue' : `${numberOfOpenIssues} open issues`}
      </Button>
    );

    if (numberOfOpenIssues > 0) {
      return <Tooltip content={<EventListing snapshotId={snapshotId} />}>{counter}</Tooltip>;
    }

    return counter;
  }
);
