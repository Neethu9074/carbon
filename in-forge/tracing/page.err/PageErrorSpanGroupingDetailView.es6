import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function PageErrorSpanGroupingDetailView({ span }) {
  const error = span.getIn(['data', 'pageErr', 'error']);

  return (
    <DescriptionList>
      <DescriptionItem title="URL">
        <a href={span.getIn(['data', 'pageErr', 'url'])} target="_blank" rel="noopener noreferrer">
          {span.getIn(['data', 'pageErr', 'url'])}
        </a>
      </DescriptionItem>

      {error
        ? <DescriptionItem title="Error Message">
            {error.get('message')}
          </DescriptionItem>
        : null}
    </DescriptionList>
  );
}
