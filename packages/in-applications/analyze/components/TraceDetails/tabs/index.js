/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Summary from 'in-applications/analyze/components/TraceDetails/tabs/Summary/Summary';
import { traceDetailFullyQualified } from 'in-analyze/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    // called Detail until we have more than one tab
    label: t('in-analyze:tabs.labelDetail'),
    path: `${traceDetailFullyQualified}/tree`,
    component: Summary,
    hideTabLabelWhenAlone: true,
    noTopPadding: true
  }
];
