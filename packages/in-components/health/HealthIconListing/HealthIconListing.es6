import React from 'react';

import { getEventsViewFilteredByEntity } from 'in-stores/navigation/paths/eventPaths';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import HealthBadge from 'in-components/health/HealthBadge';
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
    const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenEvents') : 0;

    const counter = (
      <Link href$={getEventsViewFilteredByEntity(snapshotId)} className={`${block}__link`}>
        <HealthBadge className={className} openIssues={numberOfOpenIssues} maxSeverity={maxSeverity} />
      </Link>
    );

    if (numberOfOpenIssues > 0) {
      return <Tooltip content={<EventListing snapshotId={snapshotId} />}>{counter}</Tooltip>;
    }

    return counter;
  }
);
