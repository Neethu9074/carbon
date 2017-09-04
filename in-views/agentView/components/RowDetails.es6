import React from 'react';

import './RowDetails.less';

const block = 'in-in-agent-view-table-row-details';

export default function RowDetails({ row }) {
  const notifications = row.snapshot.getIn(['data', 'notifications']);
  if (!notifications) {
    return (
      <div className={block}>
        There are no notifications for this agent. Great job!
      </div>
    );
  }
}
