/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import TimeZonesWidget from 'in-custom-dashboards/widgets/TimeZones/Widget';
import { demo } from 'in-custom-dashboards/widgets/TimeZones/demo';
import { t } from 'in-i18n';

export default function ShowCase() {
  return (
    <TimeZonesWidget
      title={t('in-custom-dashboards:widgets.timezone.demo.title')}
      isPreview
      config={demo.slice(2, 5)}
    />
  );
}
