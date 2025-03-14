/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonComposedModal as ComposedModal,
  CarbonModalFooter as ModalFooter,
  CarbonModalHeader as ModalHeader,
  CarbonModalBody as ModalBody,
  CarbonButton as Button
} from '@instana/components';
import { CarbonModal, CarbonInlineNotification, CarbonInlineLoading, Spacer } from '@instana/components';
import { LdapConfig, LdapTestResult } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getConfigAsResultObservableInternal,
  setConfigV2 as setConfig,
  deleteConfigV2 as deleteConfig,
  getTestResultV2 as getTestResult
} from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import {
  MAP_CARBON_STATUS,
  SAVE_DESCRIPTIONS,
  TEST_DESCRIPTIONS,
  DELETE_DESCRIPTIONS
} from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/constants';
import {
  SETTINGS_IDENTITY_PROVIDER_LDAP_UPDATE,
  SETTINGS_IDP_LDAP_TEST_CONFIGURATION
} from 'in-services/tracking/eventNames';
import { DeleteConfigConfirmDialog } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/DeleteConfigConfirmDialog';
import useFormWithObservable from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useObservableWithForm';
import useNotification from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useNotification';
import { isAnyInvitationsPending } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/utils';
import { LDAP_MODE } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap.types';
import { createForm } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/form';
import LdapForm from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/LdapForm';
import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import useFormSubmission from 'in-hooks/useFormSubmission';
import { pendingResult } from 'in-services/fixedObjects';
import { getInvitations$ } from 'in-api/users';
import { t, Trans } from 'in-i18n';

interface LdapDialogProps {
  isActive: boolean;
  onFormUpdate: () => void;
}

const LdapDialog = (props: LdapDialogProps) => {
  const { isActive, onFormUpdate } = props;

  const { form, setForm, dataFromObservable, loading, errorMessage } = useFormWithObservable({
    observable: getConfigAsResultObservableInternal,
    createForm: createForm,
    isActive: isActive
  });
  const mode = form.get('mode').value;
  const isEditable = mode === LDAP_MODE.EDIT;
  const [notification, setNotification] = useNotification(errorMessage);
  const invitations = useObservable(getInvitations$, []) ?? pendingResult;
  const { unstable_trackEvent, trackCta } = useSegmentTracking();
  const [ldapSubmitStatus, submitLdapConfig] = useFormSubmission<LdapConfig, unknown>(ldapConfig =>
    setConfig(ldapConfig)
  );
  const [testSubmitStatus, submitTestConnection] = useFormSubmission<LdapConfig, LdapTestResult>(ldapConfig =>
    getTestResult(ldapConfig)
  );
  const [ldapDeleteStatus, deleteLdapConfig] = useFormSubmission<undefined, unknown>(deleteConfig);

  const isSubmitting = ldapSubmitStatus === 'pending';
  const isTestingConnection = testSubmitStatus === 'pending';

  // By mapping the options as an object, we let TS help us making sure we
  // handle all the different states correctly.
  const carbonLdapStatus = MAP_CARBON_STATUS[ldapSubmitStatus ?? ''];
  const carbonTestStatus = MAP_CARBON_STATUS[testSubmitStatus ?? ''];
  const carbonDeleteStatus = MAP_CARBON_STATUS[ldapDeleteStatus ?? ''];
  const ldapDescription = SAVE_DESCRIPTIONS[ldapSubmitStatus ?? ''];
  const testDescription = TEST_DESCRIPTIONS[testSubmitStatus ?? ''];
  const deleteDescription = DELETE_DESCRIPTIONS[ldapDeleteStatus ?? ''];

  const onSaveLdapConfig = () => {
    const ldapConfig = { ...form.toJS(), ...form.get('roForm').toJS() };
    submitLdapConfig({
      payload: ldapConfig,
      onSuccess: () => {
        addMessage({
          title: t('in-settings:tabs.changesSaved'),
          content: t('in-settings:tabs.configSuccessfullySaved'),
          type: 'success',
          timeout: 4000
        });
        unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_IDENTITY_PROVIDER_LDAP_UPDATE });
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

  const onClickTestConnection = () => {
    const config: LdapConfig = { ...form.toJS(), ...form.get('roForm').toJS() };
    submitTestConnection({
      payload: config,
      onSuccess: result => {
        const { testPassed, reason } = result.data ?? {};
        const msgType = testPassed ? 'success' : 'error';
        if (testPassed) {
          setNotification({ kind: 'success', subtitle: reason });
        } else {
          setNotification({ kind: 'error', subtitle: `${t('in-settings:tabs.ldapTestFailed')} ${reason}` });
        }
        trackCta(SETTINGS_IDP_LDAP_TEST_CONFIGURATION, { result: msgType });
      },
      onError: error => {
        setNotification({ kind: 'error', subtitle: `${t('in-settings:tabs.ldapTestFailed')} ${error}` });
      }
    });
  };

  const onClickEditConfiguration = () => {
    setForm(createForm(dataFromObservable?.data, false));
  };

  const onDeleteRequest = () => {
    deleteLdapConfig({
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

  const onRequestSubmit = () => {
    if (!isEditable) {
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
            onSaveLdapConfig();
            close();
          }}
        >
          <span>
            <Trans i18nKey="in-settings:tabs.createIDPConfirmationDescription" />
          </span>
        </CarbonModal>
      );
    } else {
      onSaveLdapConfig();
    }
  };
  return (
    <ComposedModal size="md" open onClose={close}>
      <ModalHeader
        title={t('in-settings:tabs.authenticationProviders.ldapModalHeading', {
          context: isEditable ? '' : 'active'
        })}
      />
      <ModalBody hasScrollingContent hasForm aria-label="ldapForm">
        {loading && renderFallbackLoadingView()}
        {!loading && !errorMessage && <LdapForm form={form} setForm={setForm} />}
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
      </ModalBody>
      <ModalFooter>
        <Button kind="ghost" onClick={close}>
          {t('in-settings:tabs.cancel')}
        </Button>
        {isTestingConnection ? (
          <CarbonInlineLoading description={testDescription} status={carbonTestStatus} />
        ) : (
          <Button
            kind="secondary"
            onClick={isEditable ? onClickTestConnection : onClickEditConfiguration}
            disabled={!form.get('testUser').valid || !form.get('testPassword').valid}
          >
            {isEditable
              ? t('in-settings:tabs.ldapForm.testConnection')
              : t('in-settings:tabs.authenticationProviders.editConfiguration')}
          </Button>
        )}
        {isSubmitting ? (
          <>
            <Spacer size="normal" vertical="small" />
            <CarbonInlineLoading
              description={isEditable ? ldapDescription : deleteDescription}
              status={isEditable ? carbonLdapStatus : carbonDeleteStatus}
            />
          </>
        ) : (
          <Button
            kind={isEditable ? 'primary' : 'danger'}
            onClick={onRequestSubmit}
            disabled={!form.hierarchyValid || !form.hierarchyTouched}
          >
            {isEditable ? t('in-settings:tabs.save') : t('in-settings:components.delete')}
          </Button>
        )}
      </ModalFooter>
    </ComposedModal>
  );
};
export default LdapDialog;
