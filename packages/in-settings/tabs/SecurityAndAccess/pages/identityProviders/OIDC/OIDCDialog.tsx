/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import React from 'react';

import { CarbonModal, CarbonInlineNotification, Spacer } from '@instana/components';
import { OidcApiRequestConfig, OidcApiResponseConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getConfigAsResultObservableInternal,
  setConfigV2 as setConfig,
  deleteConfigV2 as deleteConfig
} from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import {
  OidcMapForm,
  secretPlaceholder,
  defaultIdpType,
  idpTypes
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDC.types';
import {
  DELETE_DESCRIPTIONS,
  MAP_CARBON_STATUS,
  SAVE_DESCRIPTIONS
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/constants';
import {
  deleteConfigEnableValidator,
  isAnyInvitationsPending
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { DeleteConfigConfirmDialog } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/DeleteConfigConfirmDialog';
import useFormWithObservable from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useObservableWithForm';
import useNotification from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useNotification';
import OIDCForm from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDCForm';
import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pendingResult } from 'in-services/fixedObjects';
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
        value: apiResult?.discoveryUri ?? '',
        validator: apiResult?.activated ? undefined : notBlankValidator
      }),
      activated: createField({
        value: !!apiResult?.activated
      }),
      isDeleteEnabled: createField({
        value: false,
        validator: apiResult?.activated ? deleteConfigEnableValidator : undefined
      }),
      idpType: createField({
        value: mappedIdpType.key ?? defaultIdpType.key
      }),
      secret: createField({
        value: apiResult?.activated ? secretPlaceholder : '',
        validator: apiResult?.activated ? undefined : notBlankValidator
      })
    }
  });
}

const OIDCDialog = (props: OIDCDialogProps) => {
  const { isActive, onFormUpdate } = props;

  const { form, setForm, loading, errorMessage } = useFormWithObservable({
    observable: getConfigAsResultObservableInternal,
    createForm: createForm
  });
  const [notification, setNotification] = useNotification(errorMessage);
  const invitations = useObservable(getInvitations$, []) ?? pendingResult;
  const { unstable_trackEvent } = useSegmentTracking();
  const [oidcSubmitStatus, submitOidcConfig] = useFormSubmission<OidcApiRequestConfig, unknown>(oidcConfig =>
    setConfig(oidcConfig)
  );
  const [oidcDeleteStatus, deleteOidcConfig] = useFormSubmission<undefined, boolean>(deleteConfig);

  const carbonOidcStatus = MAP_CARBON_STATUS[oidcSubmitStatus ?? ''];
  const carbonDeleteStatus = MAP_CARBON_STATUS[oidcDeleteStatus ?? ''];
  const oidcDescription = SAVE_DESCRIPTIONS[oidcSubmitStatus ?? ''];
  const deleteDescription = DELETE_DESCRIPTIONS[oidcDeleteStatus ?? ''];

  const onSaveOIDCConfig = () => {
    const oidcConfig = form.toJS();
    submitOidcConfig({
      payload: oidcConfig,
      onSuccess: () => {
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
      onError: result => {
        setNotification({
          kind: 'error',
          subtitle: t('in-settings:tabs.failedToSaveConfig', { err: result?.errors[0]?.message })
        });
      }
    });
  };

  const onDeleteRequest = () => {
    deleteOidcConfig({
      payload: undefined,
      onSuccess: () => {
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
      onError: result => {
        setNotification({
          kind: 'error',
          subtitle: t('in-settings:tabs.authenticationProviders.failedToDeleteConfig', {
            err: result?.errors[0]?.message
          })
        });
      }
    });
  };

  return (
    <CarbonModal
      size="md"
      open
      modalHeading={t('in-settings:tabs.authenticationProviders.oidcModalHeading', {
        context: isActive ? 'active' : ''
      })}
      danger={isActive}
      primaryButtonDisabled={!form.hierarchyValid || !form.hierarchyTouched || !!errorMessage}
      primaryButtonText={isActive ? t('in-settings:components.delete') : t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={() => {
        if (isActive) {
          return addActiveDialog(<DeleteConfigConfirmDialog onRequestSubmit={onDeleteRequest} />);
        } else if (isAnyInvitationsPending({ invitations })) {
          return addActiveDialog(
            <CarbonModal
              open
              size="sm"
              modalHeading={t('in-settings:components.confirmSave')}
              primaryButtonText={t('forms.actions.save')}
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
      loadingDescription={isActive ? deleteDescription : oidcDescription}
      loadingStatus={isActive ? carbonDeleteStatus : carbonOidcStatus}
      onSecondarySubmit={close}
      onRequestClose={close}
    >
      {loading && renderFallbackLoadingView()}
      {!loading && !errorMessage && <OIDCForm form={form} setForm={setForm} />}
      {notification && (
        <>
          <Spacer size="normal" />
          <CarbonInlineNotification
            kind={notification.kind}
            lowContrast
            title={notification.kind === 'error' ? t('in-settings:components.errorTitle') : ''}
            subtitle={notification.subtitle}
            hideCloseButton
          />
        </>
      )}
    </CarbonModal>
  );
};

export default OIDCDialog;
