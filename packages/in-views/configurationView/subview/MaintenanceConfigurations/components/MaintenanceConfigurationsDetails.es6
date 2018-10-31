import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

import './MaintenanceConfigurationsDetails.less';

const block = 'in-maintenance-config-details';

export default function MaintenanceConfigurationsDetails({ config }) {
  if (!config) {
    return null;
  }

  const windows = config.get('windows');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Name">{config.get('name')}</DescriptionItem>
        <DescriptionItem title="Query">{config.get('query')}</DescriptionItem>

        {windows.size > 0 && (
          <DescriptionItem title="Time Windows">
            {windows.map(window => (
              <ul key={window.get('id')} className={`${block}__ul`}>
                <TimeframeListItem from={window.get('start')} to={window.get('end')} />
              </ul>
            ))}
          </DescriptionItem>
        )}
      </DescriptionList>
    </div>
  );
}

function TimeframeListItem({ from, to }) {
  let timeframeString;
  if (from === 0) {
    timeframeString = `until ${formatDateTime(to)}`;
  } else {
    timeframeString = `${formatDateTime(from)} to ${formatDateTime(to)}`;
  }

  return <li className={`${block}__li`}>{timeframeString}</li>;
}
