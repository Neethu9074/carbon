/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error needs TS migration
import TechnologiesReporting from 'in-amp/components/TechnologiesReporting';
import {
  ampEntitlements,
  ampUsage,
  ampTechnologiesReporting,
  ampActivationAdoption,
  ampAccountInformation
} from 'in-amp/navigation/paths';
import Entitlements from 'in-amp/pages/AccountAndBilling/tabs/EntitlementsView';
import ActivationAdoption from 'in-amp/pages/AccountAndBilling/tabs/ActivationAdoption/ActivationAdoptionView';
//@ts-expect-error - needs TS migration
import AccountSettings from 'in-amp/components/AccountSettings';
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
  const activationAdoptionTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.activationAdoption'),
    path: ampActivationAdoption,
    component: ActivationAdoption
  };
  const technologiesReportingTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.technologiesReporting'),
    path: ampTechnologiesReporting,
    component: TechnologiesReporting
  };
  const accountInformationTab: Tab<unknown, any> = {
    label: t('in-amp:accountAndBilling.tabs.accountInformation'),
    path: ampAccountInformation,
    component: AccountSettings
  };
  return [usageTab, entitlementsTab, activationAdoptionTab, technologiesReportingTab, accountInformationTab].filter(
    Boolean
  ) as Array<Tab<unknown, any>>;
}
