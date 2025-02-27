/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonModal, Link } from '@instana/components';
import { Observable } from '@instana/observables';
import { Error, Result } from '@instana/types';

import { isAnotherIdpActivated } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/configuredIdPCheck';
import GoogleSSODialog from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSODialog';
import OIDCDialog from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDCDialog';
import { securityAndAccessSaml, securityAndAccessLdap } from 'in-settings/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { disableInvitesWithIdpEnabled } from 'in-services/featureFlags';
import { ApiItemMessage, LoadingStatus } from 'in-settings/types';
import { PendingInvitation } from 'in-api/users';
import { t, Trans } from 'in-i18n';

interface IdpConfiguration {
  title: string;
  disabledTitle: string;
  description: string;
  isActive: boolean | null | undefined;
  isAvailableToConfigure: boolean;
  helpDoc?: JSX.Element;
  IdpComponent?: JSX.Element;
  isAnotherIdpActivated: boolean;
  path?: string;
}

export const deleteItem = ({
  setMessage,
  deleteConfig
}: {
  setMessage: React.Dispatch<React.SetStateAction<ApiItemMessage | null>>;
  deleteConfig: () => Observable<boolean>;
}) => {
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-settings:components.pleaseConfirm')}
      description={
        <span>
          <Trans i18nKey="in-settings:tabs.deleteIDPConfirmationDescription" />
        </span>
      }
      onSubmit={() => {
        setMessage({ message: t('in-settings:tabs.deletingConfig'), type: 'neutral', isSaving: true });
        const setConfigResult$ = deleteConfig();
        setConfigResult$.once(
          () => {
            addMessage({
              title: t('in-settings:tabs.changesSaved'),
              content: t('in-settings:tabs.configSuccessfullyDeleted'),
              type: 'success',
              timeout: 4000
            });
          },
          (error: Error) =>
            setMessage({ text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }), type: 'error' })
        );
        close();
      }}
      confirmButtonKind="danger"
      confirmButtonLabel={t('in-settings:components.removeBtn')}
    />
  );
};

interface IsAnyInvitationsPendingProps {
  invitations: Result<PendingInvitation[]>;
}

export function isAnyInvitationsPending({ invitations }: IsAnyInvitationsPendingProps) {
  return disableInvitesWithIdpEnabled && (invitations?.data ?? []).length > 0;
}

export const SamlHelpDoc = () => (
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
export const LdapHelpDoc = () => (
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

interface onDeleteIdpConfigProps {
  deleteConfig: () => Observable<boolean>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<LoadingStatus>>;
  onFormUpdate: () => void;
}

export function onDeleteIdpConfig({ deleteConfig, setDescription, setStatus, onFormUpdate }: onDeleteIdpConfigProps) {
  return addActiveDialog(
    <CarbonModal
      open
      onRequestClose={close}
      size="sm"
      danger
      modalHeading={t('in-settings:components.pleaseConfirm')}
      primaryButtonText={t('in-settings:components.removeBtn')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={() => {
        const setConfigResult$ = deleteConfig();
        setDescription(t('in-settings:tabs.deletingConfig'));
        setStatus('active');
        setConfigResult$.once(
          () => {
            setDescription(t('in-settings:tabs.changesSaved'));
            setStatus('finished');
            addMessage({
              title: t('in-settings:tabs.changesSaved'),
              content: t('in-settings:tabs.configSuccessfullySaved'),
              type: 'success',
              timeout: 4000
            });
            close();
            close();
            onFormUpdate();
          },
          error => {
            setDescription(t('in-settings:tabs.failedToSaveConfig', { err: error.message }));
            setStatus('error');
          }
        );
      }}
    >
      <span>
        <Trans i18nKey="in-settings:tabs.deleteIDPConfirmationDescription" />
      </span>
    </CarbonModal>
  );
}

export const getIdpTilesInfo = (
  isGoogleSSOAvailable: boolean,
  isSamlAvailable: boolean,
  isOidcAvailable: boolean,
  isLdapAvailable: boolean,
  isGoogleSSOActive: boolean | null | undefined,
  isSamlActive: boolean | null | undefined,
  isOidcActive: boolean | null | undefined,
  isLdapActive: boolean | null | undefined,
  handleFormUpdate: () => void
): IdpConfiguration[] => [
  {
    title: t('in-settings:tabs.authenticationProviders.googleSSOTileTitle'),
    description: t('in-settings:tabs.authenticationProviders.googleSSOTileDescription'),
    isActive: isGoogleSSOActive,
    isAvailableToConfigure: isGoogleSSOAvailable,
    IdpComponent: <GoogleSSODialog />,
    isAnotherIdpActivated: isAnotherIdpActivated([isOidcActive, isSamlActive, isLdapActive]),
    disabledTitle: t('in-settings:tabs.authenticationProviders.cannotConfigureIdpIfAnotherOneIsAlreadyActive')
  },
  {
    title: t('in-settings:tabs.authenticationProviders.samlTileTitle'),
    description: t('in-settings:tabs.authenticationProviders.samlTileDescription'),
    isActive: isSamlActive,
    isAvailableToConfigure: isSamlAvailable,
    helpDoc: <SamlHelpDoc />,
    path: securityAndAccessSaml,
    isAnotherIdpActivated: isAnotherIdpActivated([isOidcActive, isLdapActive]),
    disabledTitle: t('in-settings:tabs.cannotConfigureSamlIfAnotherOneIsAlreadyActive')
  },
  {
    title: t('in-settings:tabs.authenticationProviders.oidcTileTitle'),
    description: t('in-settings:tabs.authenticationProviders.oidcTileDescription'),
    isActive: isOidcActive,
    isAvailableToConfigure: isOidcAvailable,
    IdpComponent: <OIDCDialog isActive={isOidcActive ?? false} onFormUpdate={handleFormUpdate} />,
    isAnotherIdpActivated: isAnotherIdpActivated([isSamlActive, isLdapActive]),
    disabledTitle: t('in-settings:tabs.cannotConfigureOidcIfAnotherOneIsAlreadyActive')
  },
  {
    title: t('in-settings:tabs.authenticationProviders.ldapTileTitle'),
    description: t('in-settings:tabs.authenticationProviders.ldapTileDescription'),
    isActive: isLdapActive,
    isAvailableToConfigure: isLdapAvailable,
    helpDoc: <LdapHelpDoc />,
    path: securityAndAccessLdap,
    isAnotherIdpActivated: isAnotherIdpActivated([isSamlActive, isOidcActive]),
    disabledTitle: t('in-settings:tabs.ldapCannotbeConfiguredWithOtherIdPActive')
  }
];
