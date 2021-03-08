/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function HibernateSpanDetailView({ span }) {
  return (
    <Dl>
      <Di title={t('in-forge:tracing.hibernate.titleMode')}>{span.getIn(['data', 'hibernate', 'mode'])}</Di>
      <Di title={t('in-forge:tracing.hibernate.titleID')}>{span.getIn(['data', 'hibernate', 'id'])}</Di>
    </Dl>
  );
}
