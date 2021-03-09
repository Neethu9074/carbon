/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { Dl, Di } from 'in-new-components/HorizontalDescriptionList';

export default function BladeSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.blade.titleViewName')}>{span.getIn(['data', 'blade', 'view'])}</Di>
        <Di title={t('in-forge:tracing.blade.titleViewPath')}>{span.getIn(['data', 'blade', 'path'])}</Di>
        <Di title={t('in-forge:tracing.blade.titleSubtemplateCount')}>
          {span.getIn(['data', 'blade', 'subtemplate_count'])}
        </Di>
      </Dl>
    </div>
  );
}
