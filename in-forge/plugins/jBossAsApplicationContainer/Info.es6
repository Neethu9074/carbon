import React from 'react';

import {emptyMap} from 'in-services/fixedImmutables';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function JBossAsInfo({snapshot}) {
  const serverInfo = snapshot.getIn(['data', 'serverInfo'], emptyMap);

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {serverInfo.get('releaseVersion')}
      </DescriptionItem>
      <DescriptionItem title='Home'>
        {serverInfo.get('homeDir')}
      </DescriptionItem>
    </DescriptionList>
  );
}
