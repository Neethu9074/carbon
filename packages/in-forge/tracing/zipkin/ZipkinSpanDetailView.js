/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function ZipkinSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.zipkin.service')}>{span.getIn(['data', 'service'])}</Di>
        <Di title={t('in-forge:tracing.zipkin.operation')}>{span.getIn(['data', 'operation'])}</Di>
        <Di title={t('in-forge:tracing.zipkin.tags')} verticalDisplay>
          <Code code={JSON.stringify(span.getIn(['data', 'tags'], emptyMap).toJS(), 0, 2)} lang="json" />
        </Di>
      </Dl>
    </div>
  );
}
