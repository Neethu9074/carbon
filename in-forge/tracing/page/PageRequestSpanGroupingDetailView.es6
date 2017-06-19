import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function PageRequestSpanGroupingDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="URL">
        <a href={span.getIn(['data', 'page', 'url'])} target="_blank" rel="noopener noreferrer">
          {span.getIn(['data', 'page', 'url'])}
        </a>
      </DescriptionItem>

      <DescriptionItem title="City">
        {span.getIn(['data', 'page', 'geo', 'city'])}
      </DescriptionItem>

      <DescriptionItem title="Country">
        {span.getIn(['data', 'page', 'geo', 'country'])}
      </DescriptionItem>

      <DescriptionItem title="Continent">
        {span.getIn(['data', 'page', 'geo', 'continent'])}
      </DescriptionItem>

      <DescriptionItem title="Browser">
        {span.getIn(['data', 'page', 'userAgent', 'browser', 'name'])}
      </DescriptionItem>

      <DescriptionItem title="OS">
        {span.getIn(['data', 'page', 'userAgent', 'os', 'name'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
