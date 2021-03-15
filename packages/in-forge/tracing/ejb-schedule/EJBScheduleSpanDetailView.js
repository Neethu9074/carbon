/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function GlassfishSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.ejbSchedule.titleScheduledTask')}>
          {span.getIn(['data', 'ejb', 'schedule', 'id'])}
        </Di>
      </Dl>
    </div>
  );
}
