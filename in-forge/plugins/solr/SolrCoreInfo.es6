import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';

export default function SolrCoreInfo({snapshot, core}) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title='Started at'>
        {formatDateTime(data.get('cores.' + core + '.started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Version'>
        {data.get('cores.' + core + '.version')}
      </DescriptionItem>
    </DescriptionList>
  );
}
