/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ActionMailSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.mail.class')}>{span.getIn(['data', 'actionmailer', 'class'])}</Di>
        <Di title={t('in-forge:tracing.mail.method')}>{span.getIn(['data', 'actionmailer', 'method'])}</Di>
      </Dl>
    </div>
  );
}
