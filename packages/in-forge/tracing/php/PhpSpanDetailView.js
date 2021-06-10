/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { kiloBytesTwoDecimalPlaces, millis } from 'in-services/formatters/number';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function HttpSpanDetailView({ span }) {
  const params = span.getIn(['data', 'http', 'params']);
  const opcache = span.getIn(['data', 'php', 'opcache']);
  const error = span.getIn(['data', 'error']);

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.php.sapiType')}>{span.getIn(['data', 'php', 'sapi'])}</Di>
        <Di title={t('in-forge:tracing.php.phpVersion')}>{span.getIn(['data', 'php', 'version'])}</Di>
        <Di title={t('in-forge:tracing.php.script')}>{span.getIn(['data', 'php', 'script'])}</Di>
        <Di title={t('in-forge:tracing.php.scriptArguments')}>{span.getIn(['data', 'php', 'argv'])}</Di>
        <Di title={t('in-forge:tracing.php.hostHeader')}>{span.getIn(['data', 'http', 'host'])}</Di>
        <Di title={t('in-forge:tracing.php.remoteAddress')}>{span.getIn(['data', 'peer', 'ip'])}</Di>
        <Di title={t('in-forge:tracing.php.requestUri')}>{span.getIn(['data', 'http', 'url'])}</Di>
        {params && (
          <Di title={t('in-forge:tracing.php.parameters')}>
            {isBlank(params) ? t('in-forge:tracing.php.noQueryParameters') : params}
          </Di>
        )}
        <Di title={t('in-forge:tracing.php.requestMethod')}>{span.getIn(['data', 'http', 'method'])}</Di>
        <Di title={t('in-forge:tracing.php.httpStatusCode')}>
          {span.getIn(['data', 'http', 'status'], span.getIn(['data', 'http', 'status_code']))}
        </Di>
        <Di title={t('in-forge:tracing.php.wordpressVersion')}>{span.getIn(['data', 'wp', 'version'])}</Di>
        <Di title={t('in-forge:tracing.php.wordpressCacheHits')}>{span.getIn(['data', 'wp', 'cache_hits'])}</Di>
        <Di title={t('in-forge:tracing.php.wordpressCacheMisses')}>{span.getIn(['data', 'wp', 'cache_misses'])}</Di>
        <Di title={t('in-forge:tracing.php.wordpressCurrentUser')}>
          {mapUserId(span.getIn(['data', 'wp', 'user_id']))}
        </Di>
        <Di title={t('in-forge:tracing.php.peakMemoryUsage')}>
          {kiloBytesTwoDecimalPlaces(span.getIn(['data', 'php', 'memory']))}
        </Di>
        <Di title={t('in-forge:tracing.php.totalCompileTime')}>
          {span.getIn(['data', 'compile', 'time']) &&
            millis.detailed(parseFloat(span.getIn(['data', 'compile', 'time']) / 1000))}
        </Di>
        {opcache && (
          <>
            <Di title={t('in-forge:tracing.php.oPcacheEnabled')}>{opcache.get('enabled')}</Di>
            <Di title={t('in-forge:tracing.php.oPcacheCacheFull')}>{opcache.get('cache_full')}</Di>
            <Di title={t('in-forge:tracing.php.oPcacheHitRate')}>{opcache.get('hit_rate')}</Di>
            <Di title={t('in-forge:tracing.php.oPcacheCachedKeys')}>{opcache.get('num_cached_keys')}</Di>
          </>
        )}
        {error && (
          <>
            <Di title={t('in-forge:tracing.php.errorMessage')}>{error.get('msg')}</Di>
            <Di title={t('in-forge:tracing.php.errorType')}>{error.get('type')}</Di>
            <Di title={t('in-forge:tracing.php.errorFile')}>{error.get('file')}</Di>
            <Di title={t('in-forge:tracing.php.errorLine')}>{error.get('line')}</Di>
          </>
        )}
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
        <Di title={t('in-forge:tracing.php.customHeaders', { header: k })} key={`header-${k}`}>
          {v}
        </Di>
      );
    })
    .valueSeq()
    .toArray();
}
