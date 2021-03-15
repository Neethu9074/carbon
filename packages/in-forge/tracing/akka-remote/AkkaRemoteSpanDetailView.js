/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function AkkaRemoteSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.akkaremote.path')}>{span.getIn(['data', 'akka', 'path'])}</Di>
      <Di title={t('in-forge:tracing.akkaremote.message')}>{span.getIn(['data', 'akka', 'msg'])}</Di>
    </Dl>
  );
}
