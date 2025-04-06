/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { AuthenticationOverview } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

//@ts-expect-error not migrated to typescript yet
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import { getNavigationTreeForAuthentication } from 'in-settings/tabs/SecurityAndAccess/navigation/authSettings';
//@ts-expect-error not migrated to typescript yet
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getNavigationTreeForRole } from 'in-settings/tabs/SecurityAndAccess/navigation/accessControl';
import { findFirstPermittedSecurityAndAccessPage } from 'in-settings/tabs/permissions';
import { securityAndAccess } from 'in-settings/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { isIdpAvailable } from 'in-settings/utils/idp';
import { getInvitations$ } from 'in-api/users';
import { role } from 'in-stores/user';

const useGetAuthConfigs = () => {
  return {
    samlConfig: useObservable(idpConfigV2Enabled ? just : getSamlConfig(undefined), []),
    ldapConfig: useObservable(idpConfigV2Enabled ? just : getLdapConfig(undefined), []),
    oidcConfig: useObservable(idpConfigV2Enabled ? just : getOidcConfig(undefined), []),
    invitations: useObservable(getInvitations$, [])
  };
};

export interface ViewProps extends AuthenticationOverview {
  /**
   * @deprecated In favor of new sso-IdpState in AuthenticationOverview props,
   * isGoogleSSOAvailable has been deprecated and should NOT be used anymore
   **/
  isGoogleSSOAvailable: boolean;
  /**
   * @deprecated In favor of new saml-IdpState in AuthenticationOverview props,
   * isSamlAvailable has been deprecated and should NOT be used anymore
   **/
  isSamlAvailable: boolean;
  /**
   * @deprecated In favor of new ldap-IdpState in AuthenticationOverview props,
   * isLdapAvailable has been deprecated and should NOT be used anymore
   **/
  isLdapAvailable: boolean;
  /**
   * @deprecated In favor of new oidc-IdpState in AuthenticationOverview props,
   * isOidcAvailable has been deprecated and should NOT be used anymore
   **/
  isOidcAvailable: boolean;
}

export default function View(props: ViewProps) {
  const authConfigs = useGetAuthConfigs();

  const navigationTree = [
    ...getNavigationTreeForRole({ ...props, role }),
    ...getNavigationTreeForAuthentication(props)
  ];

  return (
    <Fragment>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.settings,
          pageRootName: pageNames.securityAndAccess
        }}
      />

      <StickySidebarNavigationAndContent
        navigationTree={navigationTree}
        redirectToDefaultPage={findFirstPermittedSecurityAndAccessPage(
          isIdpAvailable(props.sso),
          isIdpAvailable(props.oidc),
          isIdpAvailable(props.ldap)
        )}
        redirectFrom={securityAndAccess}
        NotFoundPage={NotFoundPage}
        {...props}
        {...authConfigs}
      />
    </Fragment>
  );
}
