import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';

export default function HttpSpanDetailView({ span }) {
  const params = span.getIn(['data', 'http', 'params']);

  return (
    <div>
      <Dl>
        <Di title="SAPI Type">{span.getIn(['data', 'php', 'sapi'])}</Di>
        <Di title="PHP Version">{span.getIn(['data', 'php', 'version'])}</Di>
        <Di title="Script Arguments">{span.getIn(['data', 'php', 'argv'])}</Di>
        <Di title="Host Header">{span.getIn(['data', 'http', 'host'])}</Di>
        <Di title="Remote Address">{span.getIn(['data', 'peer', 'ip'])}</Di>
        <Di title="Request URI">{span.getIn(['data', 'http', 'url'])}</Di>
        {params != null && <Di title="Parameters">{isBlank(params) ? '<no query parameters>' : params}</Di>}
        <Di title="Request Method">{span.getIn(['data', 'http', 'method'])}</Di>
        <Di title="HTTP Status Code">
          {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
        </Di>
        <Di title="Wordpress Version">{span.getIn(['data', 'wp', 'version'])}</Di>
        <Di title="Wordpress Cache Hits">{span.getIn(['data', 'wp', 'cache_hits'])}</Di>
        <Di title="Wordpress Cache Misses">{span.getIn(['data', 'wp', 'cache_misses'])}</Di>
        <Di title="Wordpress Current User">{mapUserId(span.getIn(['data', 'wp', 'user_id']))}</Di>
        <Di title="Peak Memory Usage">{bytesTwoDecimalPlaces(span.getIn(['data', 'php', 'memory']))}</Di>
        {getCustomHeaders(span)}
      </Dl>
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
        <Di title={`Header: ${k}`} key={`header-${k}`}>
          {v}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}
