import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

import Code from 'in-components/Code';

export default function SdkSpanDetailView({span}) {
  const custom = span.getIn(['data', 'sdk', 'custom']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Captured Arguments'>
          {span.getIn(['data', 'sdk', 'arguments'])}
        </DescriptionItem>
        <DescriptionItem title='Captured Return Value'>
          {span.getIn(['data', 'sdk', 'return'])}
        </DescriptionItem>
      </DescriptionList>
      { custom ?
        <Code code={JSON.stringify(custom.toJS(), 0, 2)}
              type='json'/>
        : null }
    </div>
  );
}
