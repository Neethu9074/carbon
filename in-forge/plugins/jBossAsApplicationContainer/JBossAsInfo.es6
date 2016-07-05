import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function JBossAsInfo({snapshot}) {
  const serverInfo = snapshot.getIn(['data', 'serverInfo']);

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

JBossAsInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
