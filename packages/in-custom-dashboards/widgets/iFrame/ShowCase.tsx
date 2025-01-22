/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Widget } from 'in-custom-dashboards/widgets/iFrame/index';
import { t } from 'in-i18n';

import locals from './ShowCase.mless';

export default function ShowCase() {
  return (
    <div className={locals.wrapper}>
      <Widget
        title={t('in-custom-dashboards:widgets.iFrame.previewTitle')}
        config={{
          iframe: 'https://www.google.com/webhp?igu=1'
        }}
        isPreview
      />
    </div>
  );
}
