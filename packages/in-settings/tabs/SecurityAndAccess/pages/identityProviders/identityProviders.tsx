/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight } from '@carbon/icons-react';
import React, { useState } from 'react';

import { CarbonClickableTile, CarbonTag, Spacer, Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { getIdpTilesInfo } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { isGoogleSSOActive } from 'in-settings/tabs/SecurityAndAccess/api/googleSSO';
import { isLdapActive } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { isOidcActive } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { isSamlActive } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { t } from 'in-i18n';

import locals from './identityProviders.mless';

interface IdentityProvidersProps extends ViewProps {}

const useGetIsActiveIdpConfigs = (formUpdated: boolean) => {
  return {
    isGoogleSSOActive: useObservable(isGoogleSSOActive(), [formUpdated]),
    isSamlActive: useObservable(isSamlActive(), [formUpdated]),
    isLdapActive: useObservable(isLdapActive(), [formUpdated]),
    isOidcActive: useObservable(isOidcActive(), [formUpdated])
  };
};

const IdentityProviders = (props: IdentityProvidersProps) => {
  const { isGoogleSSOAvailable, isSamlAvailable, isOidcAvailable, isLdapAvailable } = props;

  const [formUpdated, setFormUpdted] = useState(false);
  const { isGoogleSSOActive, isSamlActive, isOidcActive, isLdapActive } = useGetIsActiveIdpConfigs(formUpdated);

  const handleFormUpdate = () => {
    setFormUpdted(!formUpdated);
  };

  const tilesInfo = getIdpTilesInfo(
    isGoogleSSOAvailable,
    isSamlAvailable,
    isOidcAvailable,
    isLdapAvailable,
    isGoogleSSOActive,
    isSamlActive,
    isOidcActive,
    isLdapActive,
    handleFormUpdate
  );

  return (
    <div>
      <Typography variant="heading-03">{t('in-settings:tabs.authenticationProviders.title')}</Typography>
      <Spacer vertical="normal" />
      <div className={locals.idpTileContainer}>
        {tilesInfo.map((idpConfig, index) => {
          const {
            isAvailableToConfigure,
            disabledTitle,
            title,
            IdpComponent,
            description,
            helpDoc,
            isActive,
            isAnotherIdpActivated,
            path
          } = idpConfig;
          return (
            isAvailableToConfigure && (
              <CarbonClickableTile
                title={isAnotherIdpActivated ? disabledTitle : title}
                renderIcon={ArrowRight}
                key={index}
                href={path ? `#${idpConfig.path}` : undefined}
                onClick={() => (IdpComponent ? addActiveDialog(IdpComponent) : null)}
                disabled={isAnotherIdpActivated}
              >
                <Typography variant="heading-02">{title}</Typography>
                <Spacer vertical="xsmall" />
                <Typography variant="body-01" component="p">
                  {description}
                </Typography>
                {helpDoc && (
                  <Typography variant="body-01" component="p">
                    {helpDoc}
                  </Typography>
                )}
                {!isAnotherIdpActivated && isActive !== undefined && (
                  <CarbonTag
                    className={locals.idpTileContainer_tagStatus}
                    size="md"
                    type={isActive ? 'green' : 'warm-gray'}
                  >
                    {t('in-settings:tabs.authenticationProviders.idp', {
                      context: isActive ? 'active' : 'inActive'
                    })}
                  </CarbonTag>
                )}
              </CarbonClickableTile>
            )
          );
        })}
      </div>
    </div>
  );
};
export default IdentityProviders;
