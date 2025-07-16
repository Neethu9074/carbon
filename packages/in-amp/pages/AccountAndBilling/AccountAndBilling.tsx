/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { generatePath, matchPath } from 'react-router';
import React from 'react';

import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader/DashboardHeader';
// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import TabView, { TabViewProps } from 'in-components/LocationAwareTabView/TabView';
import { accountBillingBasePath, ampUsage } from 'in-amp/navigation/paths';
import getTabs from 'in-amp/pages/AccountAndBilling/AccountAndBillingTabs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import legacyRedirects from 'in-settings/navigation/legacy-redirects';
import { t } from 'in-i18n';

interface AccountAndBillingProps<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>
  extends Pick<TabViewProps<unknown, TAB_PROPS, EXTENSION_PROPS>, 'location' | 'props'> {}

export default function AccountAndBilling<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>(
  props: AccountAndBillingProps<TAB_PROPS, EXTENSION_PROPS>
) {
  const { goToPath, location } = useNavigation();

  //Redirect to default tab Usage
  const shouldRedirect = !!location.pathname && location.pathname === accountBillingBasePath;

  if (shouldRedirect) {
    goToPath(ampUsage);
    return <></>;
  }

  // redirects for pre-2019 config paths (to support old bookmarks and links in docs etc.)
  for (let i = 0; i < legacyRedirects.length; i++) {
    const match = matchPath(location.pathname, legacyRedirects[i].from);
    if (match && match.isExact) {
      return createLegacyRedirect(legacyRedirects[i], match, props);
    }
  }

  const tabs = getTabs().map(tab => ({
    ...tab,
    noBottomMargin: true
  }));

  return <TabView HeaderComponent={Header} location={location} tabs={tabs} props={props} />;
}

function Header(props: Omit<DashboardHeaderProps, 'title' | 'icon' | 'label' | 'renderTimeSelection'>) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-amp:accountAndBilling.accountAndBilling')}
      icon="lib_account"
      label={t('in-amp:accountAndBilling.accountAndBilling')}
      renderTimeSelection={() => null}
    />
  );
}

function createLegacyRedirect<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>(
  legacyRedirect: (typeof legacyRedirects)[number],
  match: ReturnType<typeof matchPath>,
  props: AccountAndBillingProps<TAB_PROPS, EXTENSION_PROPS>
) {
  const params: Record<string, string | undefined> = {};
  const substitutions = legacyRedirect.params ?? {};
  Object.keys(match?.params ?? {}).forEach(p => {
    const key = p in substitutions ? substitutions[p as keyof typeof substitutions] : p;
    params[key] = match?.params[p] ?? undefined;
  });
  const to = generatePath(legacyRedirect.to, params);
  return <RedirectWithHash props={props} to={to} />;
}
