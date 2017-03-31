import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function AppInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="Application">
        {data.getIn(['appInfo', 'title'])}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.getIn(['appInfo', 'version'])}
      </DescriptionItem>
      <DescriptionItem title="Command Line">
        {data.get('name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
