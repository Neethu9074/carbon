/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function CorbaSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.corba.titleMethod')}>{span.getIn(['data', 'corba', 'method'])}</Di>
        <Di title={t('in-forge:tracing.corba.titleORB')}>{span.getIn(['data', 'corba', 'orb'])}</Di>
      </Dl>
    </div>
  );
}
