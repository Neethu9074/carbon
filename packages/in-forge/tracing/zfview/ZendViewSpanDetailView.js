/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Dl, Di } from 'in-components/HorizontalDescriptionList';
import { t } from 'in-i18n';

export default function ZendViewSpanDetailView({ span }) {
  return (
    <div>
      <Dl>
        <Di title={t('in-forge:tracing.zfview.subtemplateCount')}>
          {span.getIn(['data', 'zfview', 'subtemplate_count'])}
        </Di>
        <Di title={t('in-forge:tracing.zfview.renderer')}>{span.getIn(['data', 'zfview', 'renderer'])}</Di>
        <Di title={t('in-forge:tracing.zfview.template')}>{span.getIn(['data', 'zfview', 'template'])}</Di>
      </Dl>
    </div>
  );
}
