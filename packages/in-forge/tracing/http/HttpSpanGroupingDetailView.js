/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function HttpSpanGroupingDetailView({ span }) {
  const url = span.getIn(['data', 'http', 'url']);
  let path;
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    path = a.pathname;
  }

  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.http.titleHost')}>{span.getIn(['data', 'http', 'host'])}</Di>
        {url && url !== path ? <Di title={t('in-forge:tracing.http.titleURL')}>{url}</Di> : null}
        <Di title={t('in-forge:tracing.http.titleMethod')}>{span.getIn(['data', 'http', 'method'])}</Di>
      </Dl>
    </div>
  );
}
