/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ErrorDescriptionItem from 'in-sdk/components/traceDetails/ErrorDescriptionItem';
import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import Code from 'in-sdk/components/traceDetails/Code';
import { t } from 'in-i18n';

export default function PrismaSpanDetailView({ span }) {
  const model = span.getIn(['data', 'prisma', 'model'], '?');
  const action = span.getIn(['data', 'prisma', 'action'], '?');
  return (
    <Dl>
      <Di title={t('in-forge:tracing.prisma.url')}>{span.getIn(['data', 'prisma', 'url'])}</Di>
      <Di title={t('in-forge:tracing.prisma.provider')}>{span.getIn(['data', 'prisma', 'provider'])}</Di>
      <ErrorDescriptionItem error={span.getIn(['data', 'prisma', 'error'])} />
      {model !== '?' || action !== '?' ? (
        <Di title={t('in-forge:tracing.prisma.model_action')} verticalDisplay>
          <Code code={`${model}.${action}`} showLineNumbers={false} />
        </Di>
      ) : null}
    </Dl>
  );
}
