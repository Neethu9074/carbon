/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import Usage from 'in-amp/pages/AccountAndBilling/tabs/UsageView';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { ampUsage } from 'in-amp/navigation/paths';
import { t } from 'in-i18n';

export default function getTabs(): Array<Tab<unknown, any>> {
  const usageTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.usage'),
    path: ampUsage,
    component: Usage
  };

  return [usageTab].filter(Boolean) as Array<Tab<unknown, any>>;
}
