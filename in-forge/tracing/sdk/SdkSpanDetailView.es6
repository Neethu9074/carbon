import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';

import Code from 'in-sdk/components/traceDetails/Code';

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
        {custom ?
          <DescriptionItem title='Data'>
            <Code code={JSON.stringify(custom.toJS(), 0, 2)}
                  lang='json'/>
          </DescriptionItem>
        : null}
      </DescriptionList>

    </div>
  );
}
