/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, notBlankValidator, ValidationResult } from 'formalistic';
import React from 'react';

import { CarbonModal, CarbonInlineNotification, Spacer } from '@instana/components';
import { SamlApiConfig, SamlConfig } from '@instana/types';
import { useObservable } from '@instana/hooks';

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
import {
  getConfigAsResultObservableInternal,
  setConfig,
  deleteConfig
} from 'in-settings/tabs/SecurityAndAccess/api/saml';
import useFormWithObservable from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useObservableWithForm';
import useNotification from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useNotification';
import { SamlMapForm } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Saml/Saml.types';
import SamlForm from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Saml/SamlForm';
import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { SETTINGS_IDENTITY_PROVIDER_SAML_UPDATE } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pendingResult } from 'in-services/fixedObjects';
import { isBlank } from 'in-services/util/string';
import { getInvitations$ } from 'in-api/users';
import { t, Trans } from 'in-i18n';

interface SamlDialogProps {
  isActive: boolean;
  onFormUpdate: () => void;
}

function idpMetadataFileValidator(value: File): ValidationResult {
  const maxFileSize = 1024 * 1024 * 2;
  if (isBlank(value.name)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.samlForm.pleaseSelectFile')
      }
    ];
  }
  if (value.size > maxFileSize) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
      }
    ];
  }
  return undefined;
}

function createForm(apiResult?: SamlConfig): SamlMapForm {
  return createMapForm({
    items: {
      samlSignInCallbackUrl: createField({
        value: apiResult?.samlSignInCallbackUrl ?? ''
      }),
      samlSignOutCallbackUrl: createField({
        value: apiResult?.samlSignOutCallbackUrl ?? ''
      }),
      spEntityId: createField({
        value: apiResult?.spEntityId ?? ''
      }),
      ownerEmail: createField({
        value: '',
        validator: apiResult?.activated ? undefined : notBlankValidator
      }),
      nameIdFormat: createField({
        value: apiResult?.nameIdFormat ?? ''
      }),
      activated: createField({
        value: !!apiResult?.activated
      }),
      idpMetadataFile: createField({
        value: new File([], ''),
        validator: apiResult?.activated ? undefined : idpMetadataFileValidator
      }),
      isDeleteEnabled: createField({
        value: false,
        validator: apiResult?.activated ? deleteConfigEnableValidator : undefined
      })
    }
  });
}

const SamlDialog = (props: SamlDialogProps) => {
  const { isActive, onFormUpdate } = props;

  const { form, setForm, loading, errorMessage } = useFormWithObservable({
    observable: getConfigAsResultObservableInternal,
    createForm: createForm
  });

  const [notification, setNotification] = useNotification(errorMessage);
  const invitations = useObservable(getInvitations$, []) ?? pendingResult;
  const { unstable_trackEvent } = useSegmentTracking();
  const [samlSubmitStatus, submitSamlConfig] = useFormSubmission<SamlApiConfig, unknown>(samlConfig =>
    setConfig(samlConfig)
  );
  const [samlDeleteStatus, deleteSamlConfig] = useFormSubmission<undefined, boolean>(deleteConfig);
  const carbonSamlStatus = MAP_CARBON_STATUS[samlSubmitStatus ?? ''];
  const carbonDeleteStatus = MAP_CARBON_STATUS[samlDeleteStatus ?? ''];
  const samlDescription = SAVE_DESCRIPTIONS[samlSubmitStatus ?? ''];
  const deleteDescription = DELETE_DESCRIPTIONS[samlDeleteStatus ?? ''];
  const onSaveSamlConfig = () => {
    const samlConfig = form.toJS();
    const reader = new FileReader();
    reader.readAsText(samlConfig.idpMetadataFile, 'UTF-8');
    reader.onload = function (evt) {
      const targetResult = evt.target?.result?.toString() ?? '';
      const samlConfigPayload = { ...samlConfig, idpMetadata: targetResult };
      submitSamlConfig({
        payload: samlConfigPayload,
        onSuccess: () => {
          addMessage({
            title: t('in-settings:tabs.changesSaved'),
            content: t('in-settings:tabs.configSuccessfullySaved'),
            type: 'success',
            timeout: 4000
          });
          unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_SAML_UPDATE });
          close();
          onFormUpdate();
        },
        onError: result => {
          setNotification({
            kind: 'error',
            subtitle: t('in-settings:tabs.failedToSaveConfig', { err: result?.errors[0] })
          });
        }
      });
    };
  };
  const onDeleteRequest = () => {
    deleteSamlConfig({
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
          subtitle: t('in-settings:tabs.authenticationProviders.failedToDeleteConfig', { err: result?.errors[0] })
        });
      }
    });
  };

  return (
    <CarbonModal
      size="md"
      open
      modalHeading={t('in-settings:tabs.authenticationProviders.samlModalHeading', {
        context: isActive ? 'active' : ''
      })}
      danger={isActive}
      primaryButtonDisabled={!form?.hierarchyValid || !form.hierarchyTouched || !!errorMessage}
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
                onSaveSamlConfig();
                close();
              }}
            >
              <span>
                <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
              </span>
            </CarbonModal>
          );
        } else {
          onSaveSamlConfig();
        }
      }}
      loadingDescription={isActive ? deleteDescription : samlDescription}
      loadingStatus={isActive ? carbonDeleteStatus : carbonSamlStatus}
      onSecondarySubmit={close}
      onRequestClose={close}
    >
      {loading && renderFallbackLoadingView()}
      {!loading && !errorMessage && <SamlForm form={form} setForm={setForm} />}
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

export default SamlDialog;
