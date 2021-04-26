/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import Summary from 'in-applications/analyze/AnalyzeView2_0/Summary';
import { t } from 'in-i18n';

export default [
  {
    // called Detail until we have more than one tab
    label: t('in-applications:tabs.labelDetail'),
    path: '/analyze',
    component: Summary,
    hideTabLabelWhenAlone: true,
    noTopPadding: true
  }
];
