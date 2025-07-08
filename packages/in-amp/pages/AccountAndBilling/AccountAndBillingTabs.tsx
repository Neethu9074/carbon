/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import Entitlements from 'in-amp/pages/AccountAndBilling/tabs/EntitlementsView';
import { ampEntitlements, ampUsage } from 'in-amp/navigation/paths';
import Usage from 'in-amp/pages/AccountAndBilling/tabs/UsageView';
import { Tab } from 'in-components/LocationAwareTabView/types';
import { t } from 'in-i18n';

export default function getTabs(): Array<Tab<unknown, any>> {
  const usageTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.usage'),
    path: ampUsage,
    component: Usage
  };
  const entitlementsTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.entitlements'),
    path: ampEntitlements,
    component: Entitlements
  };
  return [usageTab, entitlementsTab].filter(Boolean) as Array<Tab<unknown, any>>;
}
