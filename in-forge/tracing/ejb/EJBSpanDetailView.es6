import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

export default function EJBSpanDetailView({span}) {
  return (
    <DescriptionList>
      <DescriptionItem title='Module'>
        {span.getIn(['data', 'ejb', 'module'])}
      </DescriptionItem>
      <DescriptionItem title='App'>
        {span.getIn(['data', 'ejb', 'app'])}
      </DescriptionItem>
      <DescriptionItem title='Bean'>
        {span.getIn(['data', 'ejb', 'bean'])}
      </DescriptionItem>
      <DescriptionItem title='Method'>
        {span.getIn(['data', 'ejb', 'method'])}
      </DescriptionItem>
      <DescriptionItem title='Node'>
        {span.getIn(['data', 'ejb', 'node'])}
      </DescriptionItem>
      <DescriptionItem title='Id'>
        {span.getIn(['data', 'ejb', 'id'])}
      </DescriptionItem>
      <DescriptionItem title='Connection'>
        {span.getIn(['data', 'ejb', 'connection'])}
      </DescriptionItem>
      <DescriptionItem title='Result'>
        {span.getIn(['data', 'ejb', 'result'])}
      </DescriptionItem>
      <DescriptionItem title='Type'>
        {span.getIn(['data', 'ejb', 'sort'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
