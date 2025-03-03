/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React, { useState } from 'react';

import { CarbonModal, CarbonInlineNotification } from '@instana/components';
import { OidcApiResponseConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  OidcMapForm,
  secretPlaceholder,
  defaultIdpType,
  idpTypes
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDC.types';
import {
  isAnyInvitationsPending,
  onDeleteIdpConfig
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import {
  getConfigAsResultObservableInternal,
  setConfig,
  deleteConfig
} from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { getUniqueErrors } from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import OIDCForm from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDCForm';
import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import useFormWithObservable from 'in-settings/hooks/useObservableWithForm';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { isLoading, hasError } from 'in-services/util/result';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { pendingResult } from 'in-services/fixedObjects';
import { LoadingStatus } from 'in-settings/types';
import { getInvitations$ } from 'in-api/users';
import { t, Trans } from 'in-i18n';

interface OIDCDialogProps {
  isActive: boolean;
  onFormUpdate: () => void;
}

function createForm(apiResult?: OidcApiResponseConfig): OidcMapForm {
  const mappedIdpType = idpTypes.filter(({ key }) => key === apiResult?.idpType)[0] ?? defaultIdpType.key;
  return createMapForm({
    items: {
      oidcSignInCallbackUrl: createField({
        value: apiResult?.oidcSignInCallbackUrl ?? ''
      }),
      oidcSignOutCallbackUrl: createField({
        value: apiResult?.oidcSignOutCallbackUrl ?? ''
      }),
      spEntityId: createField({
        value: apiResult?.spEntityId ?? ''
      }),
      ownerEmail: createField({
        value: '',
        validator: apiResult?.activated ? undefined : notBlankValidator
      }),
      discoveryUri: createField({
        value: apiResult?.discoveryUri ?? ''
      }),
      activated: createField({
        value: !!apiResult?.activated
      }),
      isDeleteEnabled: createField({
        value: false,
        validator: apiResult?.activated
          ? value =>
              value
                ? null
                : [
                    {
                      severity: 'error'
                    }
                  ]
          : undefined
      }),
      idpType: createField({
        value: mappedIdpType.key ?? defaultIdpType.key
      }),
      secret: createField({
        value: apiResult?.activated ? secretPlaceholder : '',
        validator: apiResult?.activated
          ? undefined
          : str => {
              if (!str || str.trim().length === 0 || str === secretPlaceholder) {
                return [
                  {
                    severity: 'error'
                  }
                ];
              }
              return null;
            }
      })
    }
  });
}

const OIDCDialog = (props: OIDCDialogProps) => {
  const { isActive, onFormUpdate } = props;

  const { form, setForm, dataFromObservable } = useFormWithObservable({
    observable: getConfigAsResultObservableInternal,
    createForm: createForm
  });
  const invitations = useObservable(getInvitations$, []) ?? pendingResult;
  const { unstable_trackEvent } = useSegmentTracking();
  const [status, setStatus] = useState<LoadingStatus>('inactive');
  const [description, setDescription] = useState('');
  const errors = hasError(dataFromObservable);

  const onSaveOIDCConfig = () => {
    const oidcConfig = form.toJS();
    const setConfigResult$ = setConfig(oidcConfig);
    setDescription(t('in-settings:tabs.savingConfig'));
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
        unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE });
        close();
        onFormUpdate();
      },
      error => {
        setDescription(t('in-settings:tabs.failedToSaveConfig', { err: error.message }));
        setStatus('error');
      }
    );
  };

  const onDeleteOIDCConfig = () => {
    return onDeleteIdpConfig({ deleteConfig, setDescription, setStatus, onFormUpdate });
  };

  return (
    <CarbonModal
      size="md"
      open
      modalHeading={t('in-settings:tabs.authenticationProviders.oidcModalHeading', {
        context: isActive ? 'active' : ''
      })}
      danger={isActive}
      primaryButtonDisabled={!form?.hierarchyValid || !form.hierarchyTouched || errors}
      primaryButtonText={isActive ? 'Delete' : t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={() => {
        if (isActive) {
          onDeleteOIDCConfig();
        } else if (isAnyInvitationsPending({ invitations })) {
          return addActiveDialog(
            <CarbonModal
              open
              size="sm"
              modalHeading={t('in-settings:components.confirmRemove')}
              primaryButtonText={t('in-components:dialog.confirmationDialogLabelConfirm')}
              secondaryButtonText={t('in-settings:tabs.cancel')}
              onRequestClose={close}
              onRequestSubmit={() => {
                onSaveOIDCConfig();
                close();
              }}
            >
              <span>
                <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
              </span>
            </CarbonModal>
          );
        } else {
          onSaveOIDCConfig();
        }
      }}
      loadingDescription={description}
      loadingStatus={status}
      onSecondarySubmit={close}
      onRequestClose={close}
    >
      {isLoading(dataFromObservable) && renderFallbackLoadingView()}
      {errors && (
        <CarbonInlineNotification
          kind="error"
          lowContrast
          title={t('in-settings:components.errorTitle')}
          subtitle={getUniqueErrors(dataFromObservable.errors)[0]}
        />
      )}
      {!errors && <OIDCForm form={form} setForm={setForm} />}
    </CarbonModal>
  );
};

export default OIDCDialog;
