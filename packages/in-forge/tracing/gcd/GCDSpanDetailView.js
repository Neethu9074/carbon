/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function GCDSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.gcd.titleOperation')}>{span.getIn(['data', 'gcd', 'op'])}</Di>
        <Di title={t('in-forge:tracing.gcd.titleOperationMode')}>{span.getIn(['data', 'gcd', 'mode'])}</Di>
        <Di title={t('in-forge:tracing.gcd.titleNamespace')}>{span.getIn(['data', 'gcd', 'namespace'])}</Di>
        <Di title={t('in-forge:tracing.gcd.titleEntityIdentifier')}>{span.getIn(['data', 'gcd', 'entity', 'identifier'])}</Di>
        <Di title={t('in-forge:tracing.gcd.titleEntityproperties')}>{span.getIn(['data', 'gcs', 'entity', 'properties'])}</Di>
      </Dl>
    </div>
  );
}
