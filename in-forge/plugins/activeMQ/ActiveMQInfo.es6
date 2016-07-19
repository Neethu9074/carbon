import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';


export default function ActiveMQInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
    </DescriptionList>
  );
}

ActiveMQInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
