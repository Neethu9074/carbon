/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight } from '@carbon/icons-react';
import React from 'react';

import { CarbonClickableTile, CarbonTag, Link, Spacer, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  securityAndAccessGoogleSSO,
  securityAndAccessLdap,
  securityAndAccessOidc,
  securityAndAccessSaml
} from 'in-settings/navigation/paths';
import { isGoogleSSOActive } from 'in-settings/tabs/SecurityAndAccess/api/googleSSO';
import { isLdapActive } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { isOidcActive } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { isSamlActive } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { t, Trans } from 'in-i18n';

import locals from './identityProviders.mless';

interface IdpConfiguration {
  title: string;
  description: string;
  isActive: boolean;
  isAvailableToConfigure: boolean;
  helpDoc?: JSX.Element;
  path: string;
}

interface IdentityProvidersProps extends ViewProps {}

const useGetIsActiveIdpConfigs = () => {
  return {
    isGoogleSSOActive: useObservable(isGoogleSSOActive(), []) as boolean,
    isSamlActive: useObservable(isSamlActive(), []) as boolean,
    isLdapActive: useObservable(isLdapActive(), []) as boolean,
    isOidcActive: useObservable(isOidcActive(), []) as boolean
  };
};

const SamlHelpDoc = () => (
  <Trans
    i18nKey="in-settings:tabs.authenticationProviders.samlTileHelpDoc"
    components={{
      activeDirectoryLink: (
        <Link external href="https://ibm.biz/configuring-active-directory">
          null
        </Link>
      ),
      oktaLink: (
        <Link external href="https://ibm.biz/integrating-okta">
          null
        </Link>
      )
    }}
  />
);
const LdapHelpDoc = () => (
  <Trans
    i18nKey="in-settings:tabs.authenticationProviders.ldapHelpDoc"
    components={{
      docLink: (
        <Link
          external
          href=" https://www.ibm.com/docs/en/instana-observability/current?topic=configuration-configuring-ldap"
        >
          null
        </Link>
      )
    }}
  />
);
const IdentityProviders = (props: IdentityProvidersProps) => {
  const { isGoogleSSOActive, isSamlActive, isOidcActive, isLdapActive } = useGetIsActiveIdpConfigs();
  const getIdpConfigurations = (): IdpConfiguration[] => [
    {
      title: t('in-settings:tabs.authenticationProviders.googleSSOTileTitle'),
      description: t('in-settings:tabs.authenticationProviders.googleSSOTileDescription'),
      isActive: isGoogleSSOActive,
      isAvailableToConfigure: props.isGoogleSSOAvailable,
      path: securityAndAccessGoogleSSO
    },
    {
      title: t('in-settings:tabs.authenticationProviders.samlTileTitle'),
      description: t('in-settings:tabs.authenticationProviders.samlTileDescription'),
      isActive: isSamlActive,
      isAvailableToConfigure: props.isSamlAvailable,
      helpDoc: <SamlHelpDoc />,
      path: securityAndAccessSaml
    },
    {
      title: t('in-settings:tabs.authenticationProviders.oidcTileTitle'),
      description: t('in-settings:tabs.authenticationProviders.oidcTileDescription'),
      isActive: isOidcActive,
      isAvailableToConfigure: props.isOidcAvailable,
      path: securityAndAccessOidc
    },
    {
      title: t('in-settings:tabs.authenticationProviders.ldapTileTitle'),
      description: t('in-settings:tabs.authenticationProviders.ldapTileDescription'),
      isActive: isLdapActive,
      isAvailableToConfigure: props.isLdapAvailable,
      helpDoc: <LdapHelpDoc />,
      path: securityAndAccessLdap
    }
  ];
  return (
    <div>
      <Typography variant="heading-03">{t('in-settings:tabs.authenticationProviders.title')}</Typography>
      <Spacer vertical="normal" />
      <div className={locals.idpTileContainer}>
        {getIdpConfigurations().map(
          (idpConfig, index) =>
            idpConfig.isAvailableToConfigure && (
              <CarbonClickableTile
                title={idpConfig.title}
                renderIcon={ArrowRight}
                key={index}
                href={`#${idpConfig.path}`}
              >
                <Typography variant="heading-02">{idpConfig.title}</Typography>
                <Spacer vertical="xsmall" />
                <Typography variant="body-01" component="p">
                  {idpConfig.description}
                </Typography>
                {idpConfig.helpDoc && (
                  <Typography variant="body-01" component="p">
                    {idpConfig.helpDoc}
                  </Typography>
                )}
                <CarbonTag
                  className={locals.idpTileContainer_tagStatus}
                  size="md"
                  title="Clear filter"
                  type={idpConfig.isActive ? 'green' : 'warm-gray'}
                >
                  {t('in-settings:tabs.authenticationProviders.idp', {
                    context: idpConfig.isActive ? 'active' : 'inActive'
                  })}
                </CarbonTag>
              </CarbonClickableTile>
            )
        )}
      </div>
    </div>
  );
};
export default IdentityProviders;
