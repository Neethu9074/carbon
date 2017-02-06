import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {modes} from 'in-forge/plugins/instanaAgent/modes';
import {emptyMap} from 'in-services/fixedImmutables';

export default function Info({snapshot}) {
  const data = snapshot.getIn(['data', 'java'], emptyMap);
  const mode = snapshot.getIn(['data', 'mode']);

  return (
    <DescriptionList>
      {mode ?
        <DescriptionItem title='Mode'>
          {modes[mode]}
        </DescriptionItem>
      : null}
      <DescriptionItem title='Java Version'>
        {data.get('version')}{' '}
        {data.get('vmversion')}
      </DescriptionItem>

      <DescriptionItem title='Java Runtime'>
        {data.get('vmvendor')}<br />
        {data.get('vmname')}
      </DescriptionItem>
    </DescriptionList>
  );
}
