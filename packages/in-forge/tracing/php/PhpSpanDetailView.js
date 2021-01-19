/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { kiloBytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';

export default function HttpSpanDetailView({ span }) {
  const params = span.getIn(['data', 'http', 'params']);

  return (
    <div>
      <Dl>
        <Di title="SAPI Type">{span.getIn(['data', 'php', 'sapi'])}</Di>
        <Di title="PHP Version">{span.getIn(['data', 'php', 'version'])}</Di>
        <Di title="Script">{span.getIn(['data', 'php', 'script'])}</Di>
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
        <Di title="Peak Memory Usage">{kiloBytesTwoDecimalPlaces(span.getIn(['data', 'php', 'memory']))}</Di>
        <Di title="Total Compile Time">
          {span.getIn(['data', 'compile', 'time']) &&
            millis.detailed(parseFloat(span.getIn(['data', 'compile', 'time']) / 1000))}
        </Di>
        <Di title="OPcache Enabled">{span.getIn(['data', 'opcache', 'enabled'])}</Di>
        <Di title="OPcache Cache Full">{span.getIn(['data', 'opcache', 'cache_full'])}</Di>
        <Di title="OPcache Hit Rate">{span.getIn(['data', 'opcache', 'hit_rate'])}</Di>
        <Di title="OPcache Cached Keys">{span.getIn(['data', 'opcache', 'num_cached_keys'])}</Di>
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
