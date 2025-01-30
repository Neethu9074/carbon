/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Fragment } from 'react';

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

//@ts-expect-error not migrated to typescript yet
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
//@ts-expect-error not migrated to typescript yet
import { getConfigAsResultObservable as getSamlConfig } from 'in-settings/tabs/SecurityAndAccess/api/saml';
//@ts-expect-error not migrated to typescript yet
import { getConfigAsResultObservable as getLdapConfig } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
//@ts-expect-error not migrated to typescript yet
import { getConfigAsResultObservable as getOidcConfig } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
//@ts-expect-error not migrated to typescript yet
import { findFirstPermittedSecurityAndAccessPage } from 'in-settings/tabs/permissions';
import { getNavigationTreeForAuthentication } from 'in-settings/tabs/SecurityAndAccess/navigation/authSettings';
//@ts-expect-error not migrated to typescript yet
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { getNavigationTreeForRole } from 'in-settings/tabs/SecurityAndAccess/navigation/accessControl';
import useIsAnyIdPActive from 'in-settings/hooks/useIsAnyIdPActive';
import { securityAndAccess } from 'in-settings/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { getInvitations$ } from 'in-api/users';
import { role } from 'in-stores/user';

const useGetAuthConfigs = () => {
  return {
    samlConfig: useObservable(idpConfigV2Enabled ? just : getSamlConfig(), []),
    ldapConfig: useObservable(idpConfigV2Enabled ? just : getLdapConfig([]), []),
    oidcConfig: useObservable(idpConfigV2Enabled ? just : getOidcConfig([]), []),
    invitations: useObservable(getInvitations$, [])
  };
};

export interface ViewProps {
  isGoogleSSOAvailable: boolean;
  isSamlAvailable: boolean;
  isLdapAvailable: boolean;
  isOidcAvailable: boolean;
}

export default function View(props: ViewProps) {
  const isAnyIDPActive = useIsAnyIdPActive();
  const authConfigs = useGetAuthConfigs();

  const navigationTree = [
    ...getNavigationTreeForRole(role as any, isAnyIDPActive),
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
          props.isGoogleSSOAvailable,
          props.isSamlAvailable,
          props.isLdapAvailable
        )}
        redirectFrom={securityAndAccess}
        NotFoundPage={NotFoundPage}
        {...props}
        {...authConfigs}
      />
    </Fragment>
  );
}
