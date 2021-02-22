/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';

import locals from './LoadingIndicator.mless';

export default function LoadingIndicator({ text = t('in-custom-dashboards:widgets.srcInfrastructure.metricsLoadIndicator.loadingMetrics') }) {
  return (
    <div className={locals.wrapper}>
      {/* Use the same vertical height as the active grouping indication */}
      <IndeterminateLoadingIndicator size={27} />
      <span className={locals.text}>{text}</span>
    </div>
  );
}
