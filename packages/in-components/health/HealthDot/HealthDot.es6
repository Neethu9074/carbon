import React from 'react';

import { getEventsViewFilteredByEntity } from 'in-stores/navigation/paths/eventPaths';
import { getColorBySeverity, getHealthInfoAtFocusedMoment } from 'in-stores/events';
import EventListing from 'in-components/EventListing';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import './HealthDot.less';

const block = 'in-health-dot';

const severityOpts = { theme: 'day' };

export default connectTo(
  props => ({
    healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId),
    href: getEventsViewFilteredByEntity(props.snapshotId)
  }),
  function HealthDot({ healthInfo, href, snapshotId }) {
    if (!healthInfo) {
      return null;
    }

    const numberOfOpenIssues = healthInfo ? healthInfo.get('numberOfOpenEvents') : 0;
    const maxSeverity = healthInfo ? healthInfo.get('maxSeverity') : 0;

    const dot = (
      <a href={href} className={block} style={{ background: getColorBySeverity(maxSeverity, severityOpts) }}>
        {numberOfOpenIssues === 1 ? '1 open issue' : `${numberOfOpenIssues} open issues`}
      </a>
    );

    if (numberOfOpenIssues > 0) {
      return <Tooltip content={<EventListing snapshotId={snapshotId} />}>{dot}</Tooltip>;
    }

    return <Tooltip content="No open issues">{dot}</Tooltip>;
  }
);
