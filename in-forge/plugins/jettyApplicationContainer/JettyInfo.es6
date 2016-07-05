import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-components/Collapsible';
import {formatDateTime} from 'in-services/formatters/date';


export default function JettyInfo({snapshot}) {
  const data = snapshot.get('data');
  const startedAt = data.get('startedAt');
  if (!startedAt) {
    return null;
  }
  return (
    <Collapsible initiallyOpen={true}>
      <Collapsible.Header>Jetty Server Info</Collapsible.Header>
      <Collapsible.Content>
        <DescriptionList>
          <DescriptionItem title='Version'>
            {data.get('version')}
          </DescriptionItem>
          <DescriptionItem title='Started At'>
            {formatDateTime(startedAt)}
          </DescriptionItem>
        </DescriptionList>
      </Collapsible.Content>
    </Collapsible>
  );
}

JettyInfo.propTypes = {
  snapshot: irpt.map.isRequired
};
