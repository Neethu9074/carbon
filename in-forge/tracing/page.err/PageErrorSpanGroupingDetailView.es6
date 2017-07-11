import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Link from 'in-components/Link';

export default function PageErrorSpanGroupingDetailView({ span }) {
  const error = span.getIn(['data', 'pageErr', 'error']);

  return (
    <DescriptionList>
      <DescriptionItem title="URL">
        <Link href={span.getIn(['data', 'pageErr', 'url'])} external>
          {span.getIn(['data', 'pageErr', 'url'])}
        </Link>
      </DescriptionItem>

      {error
        ? <DescriptionItem title="Error Message">
            {error.get('message')}
          </DescriptionItem>
        : null}
    </DescriptionList>
  );
}
