/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';

import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';

export default function getTabs({ path }) {
  return [
    {
      // called Detail until we have more than one tab
      label: t('in-websites:analyze.analyzeView.pageLoadView.indexLabelDetails'),
      path: path ?? `${pageLoadViewPathFullyQualified}/summary`,
      component: Summary,
      hideTabLabelWhenAlone: true
    }
  ];
}
