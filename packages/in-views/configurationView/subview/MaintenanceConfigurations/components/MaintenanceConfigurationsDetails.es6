import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

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
          <DescriptionList>
            <DescriptionItem title="Time Windows">
              {windows.map(window => (
                <div key={window.get('id')}>
                  <Timeframe from={window.get('start')} to={window.get('end')} />
                </div>
              ))}
            </DescriptionItem>
          </DescriptionList>
        )}
      </DescriptionList>
    </div>
  );
}

function Timeframe({ from, to }) {
  let timeframeString;
  if (from === 0) {
    timeframeString = `until ${formatDateTime(to)}`;
  } else {
    timeframeString = `${formatDateTime(from)} to ${formatDateTime(to)}`;
  }

  return <span>{timeframeString}</span>;
}
