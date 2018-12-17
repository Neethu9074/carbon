import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';

export default function HttpSpanDetailView({ span }) {
  const params = span.getIn(['data', 'http', 'params']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="SAPI Type">{span.getIn(['data', 'php', 'sapi'])}</DescriptionItem>
        <DescriptionItem title="PHP Version">{span.getIn(['data', 'php', 'version'])}</DescriptionItem>
        <DescriptionItem title="Host Header">{span.getIn(['data', 'http', 'host'])}</DescriptionItem>
        <DescriptionItem title="Remote Address">{span.getIn(['data', 'peer', 'ip'])}</DescriptionItem>
        <DescriptionItem title="Request URI">{span.getIn(['data', 'http', 'url'])}</DescriptionItem>
        {params != null && (
          <DescriptionItem title="Parameters">{isBlank(params) ? '<no query parameters>' : params}</DescriptionItem>
        )}
        <DescriptionItem title="Request Method">{span.getIn(['data', 'http', 'method'])}</DescriptionItem>
        <DescriptionItem title="HTTP Status Code">
          {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
        </DescriptionItem>
        <DescriptionItem title="Wordpress Version">{span.getIn(['data', 'wp', 'version'])}</DescriptionItem>
        <DescriptionItem title="Wordpress Cache Hits">{span.getIn(['data', 'wp', 'cache_hits'])}</DescriptionItem>
        <DescriptionItem title="Wordpress Cache Misses">{span.getIn(['data', 'wp', 'cache_misses'])}</DescriptionItem>
        <DescriptionItem title="Wordpress Current User">
          {mapUserId(span.getIn(['data', 'wp', 'user_id']))}
        </DescriptionItem>
        <DescriptionItem title="Peak Memory Usage">{span.getIn(['data', 'php', 'memory'])}</DescriptionItem>
        {getCustomHeaders(span)}
      </DescriptionList>
    </div>
  );
}

function mapUserId(userId) {
  return userId > 0 ? userId : null;
}

function getCustomHeaders(span) {
  return span
    .getIn(['data', 'http', 'header'], emptyMap)
    .map((v, k) => {
      return (
        <DescriptionItem title={`Header: ${k}`} key={`header-${k}`}>
          {v}
        </DescriptionItem>
      );
    })
    .valueSeq()
    .toArray();
}
