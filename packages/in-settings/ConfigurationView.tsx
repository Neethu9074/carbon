/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generatePath, matchPath } from 'react-router';
import React from 'react';

import { AuthenticationOverview } from '@instana/types';

import { settingsBasePath, globalSettings, userSettingsGeneral } from 'in-settings/navigation/paths';
// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import TabView, { TabViewProps } from 'in-components/LocationAwareTabView/TabView';
import { roleHasAnyGlobalPermissions } from 'in-settings/tabs/permissions';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import legacyRedirects from 'in-settings/navigation/legacy-redirects';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import useAuthOverview from 'in-settings/hooks/useAuthOverview';
import { isIdpAvailable } from 'in-settings/utils/idp';
import getTabs from 'in-settings/tabs/index';
import { t } from 'in-i18n';

interface ConfigurationViewProps<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>
  extends Pick<TabViewProps<unknown, TAB_PROPS, EXTENSION_PROPS>, 'location' | 'props'> {}

export default function ConfigurationView<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>(
  props: ConfigurationViewProps<TAB_PROPS, EXTENSION_PROPS>
) {
  const { goToPath, location } = useNavigation();
  // in-components/AppHeader/components/AccountMenu/components/Menu (and possibly old bookmarks) just points to
  // /config, we redirect this to the default tab (global settings).
  const shouldRedirect = !!location.pathname && location.pathname === settingsBasePath;
  const [authOverview] = useAuthOverview({ preventRequest: shouldRedirect });
  const authProps: AuthenticationOverview = {
    defaultLogin: !!authOverview?.defaultLogin,
    ldap: authOverview?.ldap ?? 'DISABLED',
    oidc: authOverview?.oidc ?? 'DISABLED',
    saml: authOverview?.saml ?? 'DISABLED',
    sso: authOverview?.sso ?? 'DISABLED'
  };
  const viewProps: ViewProps = {
    isGoogleSSOAvailable: isIdpAvailable(authProps.sso),
    isLdapAvailable: isIdpAvailable(authProps.ldap),
    isOidcAvailable: isIdpAvailable(authProps.oidc),
    isSamlAvailable: isIdpAvailable(authProps.saml),
    ...authProps
  };

  if (shouldRedirect) {
    const redirectionPath = roleHasAnyGlobalPermissions() ? globalSettings : userSettingsGeneral;
    goToPath(redirectionPath);

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

  return (
    <TabView
      HeaderComponent={Header}
      location={location}
      tabs={tabs}
      props={{
        ...props,
        ...viewProps
      }}
    />
  );
}

function Header(props: Omit<DashboardHeaderProps, 'title' | 'icon' | 'label' | 'renderTimeSelection'>) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-settings:settings')}
      icon="lib_actions_settings"
      label={t('in-settings:settings')}
      renderTimeSelection={() => null}
    />
  );
}

function createLegacyRedirect<TAB_PROPS extends {}, EXTENSION_PROPS extends {}>(
  legacyRedirect: (typeof legacyRedirects)[number],
  match: ReturnType<typeof matchPath>,
  props: ConfigurationViewProps<TAB_PROPS, EXTENSION_PROPS>
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
