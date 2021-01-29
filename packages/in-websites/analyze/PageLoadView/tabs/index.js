/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { pageLoadViewPathFullyQualified } from 'in-websites/navigation/paths';
import Summary from 'in-websites/analyze/PageLoadView/tabs/Summary/Summary';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';

export default function getTabs({ path }) {
  return [
    {
      // called Detail until we have more than one tab
      label: 'Details',
      path: path ?? `${pageLoadViewPathFullyQualified}/summary`,
      component: Summary,
      hideTabLabelWhenAlone: true,
      noTopPadding: webMobileQb2AnalyzeEnabled
    }
  ];
}
