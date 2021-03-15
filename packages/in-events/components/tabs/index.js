/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import Summary from 'in-events/components/tabs/Summary/Summary';
import { eventsPath } from 'in-events/navigation/paths';
import { t } from 'in-i18n';

export default [
  {
    label: t('in-events:labelSummary'),
    path: eventsPath,
    component: Summary,
    hideTabLabelWhenAlone: true
  }
];
