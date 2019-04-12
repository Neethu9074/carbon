import React from 'react';

import { DescriptionItem, DescriptionList } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';

export default function TimeOfLastUpdateDescriptionItem({ data }) {
  if (!data) {
    return null;
  }

  const timestamp = data.get('timestamp');

  if (!timestamp) {
    return null;
  }

  return (
    <DescriptionList>
      <DescriptionItem title="Time of last update">{formatDateTime(timestamp)}</DescriptionItem>
    </DescriptionList>
  );
}
