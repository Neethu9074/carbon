/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ShellSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.shell.shellCommand')}>{span.getIn(['data', 'shell', 'cmd'])}</Di>
    </Dl>
  );
}
