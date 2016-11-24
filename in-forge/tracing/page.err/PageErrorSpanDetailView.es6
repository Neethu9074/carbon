import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';


export default function PageErrorSpanDetailView({span}) {
  const error = span.getIn(['data', 'pageErr', 'error']);
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title='Application'>
          {span.getIn(['data', 'pageErr', 'appName'])}
        </DescriptionItem>

        <DescriptionItem title='URL'>
          <a href={span.getIn(['data', 'pageErr', 'url'])}
             target='_blank'>
            {span.getIn(['data', 'pageErr', 'url'])}
          </a>
        </DescriptionItem>

        {error ?
          <DescriptionItem title='Error'>
            <Code code={JSON.stringify(error, 0, 2)}
                  lang='json' />
          </DescriptionItem>
        : null}
      </DescriptionList>
    </div>
  );
}
