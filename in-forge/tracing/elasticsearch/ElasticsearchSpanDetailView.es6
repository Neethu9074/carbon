import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Code from 'in-components/Code';

export default function ElasticsearchSpanDetailView({span}) {
  const query = span.getIn(['data', 'elasticsearch', 'query']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Action'>
          {span.getIn(['data', 'elasticsearch', 'action'])}
        </DescriptionItem>
        <DescriptionItem title='Index'>
          {span.getIn(['data', 'elasticsearch', 'index'])}
        </DescriptionItem>
        <DescriptionItem title='Type'>
          {span.getIn(['data', 'elasticsearch', 'type'])}
        </DescriptionItem>
      </DescriptionList>
      {query ?
        <Code code={JSON.stringify(JSON.parse(query), 0, 2)}
              type='json' />
      : null}
    </div>
  );
}
