/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Card } from '@instana/components';

import SidebarTagList from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/SidebarTagList';
import { Dl } from 'in-components/HorizontalDescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';

export default function OpenTelemetrySyntheticBatchSpanDetailView({ span }) {
  const toKeyValueMap = map => Object.entries(map).map(([name, value]) => ({ name, value }));
  const resource = toKeyValueMap(span.getIn(['data', 'resource'], emptyMap).toJS());
  return (
    <>
      <div>
        <Dl>
          <div>{t('in-forge:tracing.otelBatchSynthetic.bodyApproximated')}</div>
        </Dl>
        <Card title={t('in-forge:tracing.otel.resource')} hasMarginBottom>
          <SidebarTagList tags={resource} />
        </Card>
      </div>
    </>
  );
}
