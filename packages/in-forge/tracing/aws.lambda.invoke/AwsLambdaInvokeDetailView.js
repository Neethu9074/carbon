/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AwsLambdaInvokeDetailView({ span }) {
  return (
    <>
      <Di title={t('in-forge:tracing.LambdaInvoke.titleARN')}>
        {span.getIn(['data', 'aws', 'lambda', 'invoke', 'function'])}
      </Di>
      <Di title={t('in-forge:tracing.LambdaInvoke.titleInvokeType')}>
        {span.getIn(['data', 'aws', 'lambda', 'invoke', 'type'])}
      </Di>
    </>
  );
}
