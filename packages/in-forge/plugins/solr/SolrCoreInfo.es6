import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';

export default function SolrCoreInfo({ snapshot, core }) {
  const data = snapshot.get('data');
  const start = data.get('cores.' + core + '.started_at');
  return (
    <DescriptionList>
      {start && (
        <DescriptionItem title="Started At">
          {formatDateTime(start)} ({fromNowAccurately(start)})
        </DescriptionItem>
      )}
      <DescriptionItem title="Version">{data.get('cores.' + core + '.version')}</DescriptionItem>
    </DescriptionList>
  );
}
