/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function LaminasViewSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.laminasView.titleSubtemplateCount')}>
          {span.getIn(['data', 'laminasview', 'subtemplate_count'])}
        </Di>
        <Di title={t('in-forge:tracing.laminasView.titleRenderer')}>
          {span.getIn(['data', 'laminasview', 'renderer'])}
        </Di>
        <Di title={t('in-forge:tracing.laminasView.titleTemplate')}>
          {span.getIn(['data', 'laminasview', 'template'])}
        </Di>
      </Dl>
    </div>
  );
}
