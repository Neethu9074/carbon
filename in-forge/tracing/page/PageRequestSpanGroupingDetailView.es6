import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Link from 'in-components/Link';

export default function PageRequestSpanGroupingDetailView({ span }) {
  return (
    <DescriptionList>
      <DescriptionItem title="URL">
        <Link href={span.getIn(['data', 'page', 'url'])} external>
          {span.getIn(['data', 'page', 'url'])}
        </Link>
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
