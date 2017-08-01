import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Link from 'in-components/Link';

export default function PageResourceRequestSpanDetailView({ span }) {
  const encodedBodySize = span.getIn(['data', 'page_res', 'encodedBodySize']);
  return (
    <DescriptionList>
      <DescriptionItem title="URL">
        <Link href={span.getIn(['data', 'page_res', 'url'])} external>
          {span.getIn(['data', 'page_res', 'url'])}
        </Link>
      </DescriptionItem>

      <DescriptionItem title="Initiator">
        {span.getIn(['data', 'page_res', 'initiator'])}
      </DescriptionItem>

      {encodedBodySize
        ? <DescriptionItem title="Encoded Body Size">
            {bytesTwoDecimalPlaces(encodedBodySize)}
          </DescriptionItem>
        : null}

      <DescriptionItem title="Cache Status">
        {span.getIn(['data', 'page_res', 'caching'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
