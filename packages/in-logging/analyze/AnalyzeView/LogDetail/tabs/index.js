/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Summary from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/Summary/Summary';
import { logsPath } from 'in-logging/navigation/paths';
import { t } from 'in-i18n';

export default function getTags({ path }) {
  return [
    {
      label: t('in-logging:detail'),
      path: path ?? logsPath,
      component: Summary,
      hideTabLabelWhenAlone: true,
      noTopPadding: true
    }
  ];
}
