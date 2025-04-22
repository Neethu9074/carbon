/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ArrowRight } from '@carbon/icons-react';
import React from 'react';

import { CarbonClickableTile, CarbonTag, Spacer, Typography } from '@instana/components';

import { getIdpTilesInfo } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { t } from 'in-i18n';

import locals from './identityProviders.mless';
import { refreshAuthOverview } from 'in-settings/tabs/GlobalSettings/api/auth';
import { isIdpActive, isIdpAvailable } from 'in-settings/utils/idp';

interface IdentityProvidersProps extends ViewProps {}

const IdentityProviders = (props: IdentityProvidersProps) => {
  const { ldap, oidc, saml, sso } = props;

  const tilesInfo = getIdpTilesInfo(
    ldap ?? 'DISABLED',
    oidc ?? 'DISABLED',
    saml ?? 'DISABLED',
    sso ?? 'DISABLED',
    refreshAuthOverview
  );

  return (
    <div>
      <Typography variant="heading-03">{t('in-settings:tabs.authenticationProviders.title')}</Typography>
      <Spacer vertical="normal" />
      <div className={locals.idpTileContainer}>
        {tilesInfo.map((idpConfig, index) => {
          const { IdpComponent, description, disabledTitle, helpDoc, id, idpState, isAnotherIdpActivated, title } =
            idpConfig;
          const isActive = isIdpActive(idpState);
          return (
            isIdpAvailable(idpState) && (
              <CarbonClickableTile
                title={isAnotherIdpActivated ? disabledTitle : title}
                renderIcon={ArrowRight}
                key={index}
                onClick={() => addActiveDialog(IdpComponent)}
                disabled={isAnotherIdpActivated}
                id={id}
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
                {!isAnotherIdpActivated && (
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
