import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function RedisEnterpriseDatabaseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="ID">{data.get('uid')}</DescriptionItem>
    </DescriptionList>
  );
}
