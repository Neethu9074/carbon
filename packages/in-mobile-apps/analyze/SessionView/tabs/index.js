/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sessionViewPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import Summary from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Summary';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function getTabs({ path }) {
  return [
    {
      label: t('in-mobile-apps:sessionView.tabsDetailLabel'),
      path: path ?? `${sessionViewPathFullyQualified}/summary`,
      component: Summary,
      hideTabLabelWhenAlone: true,
      noTopPadding: webMobileQb2AnalyzeEnabled
    }
  ];
}
