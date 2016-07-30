import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function SolrInfo({snapshot}) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title='Process ID'>
        {data.get('pid')}
      </DescriptionItem>
    </DescriptionList>
  );
}

SolrInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
