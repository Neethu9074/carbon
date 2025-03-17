/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { CarbonInlineNotification, CarbonModal } from '@instana/components';
import { GoogleSSOConfig } from '@instana/types';
import { t } from '@instana/i18n-react';

import useFormWithObservable from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/hooks/useObservableWithForm';
import { GoogleSsoMapForm } from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSO.types';
import GoogleSSOForm from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSOForm';
import { getConfigAsResultObservable, setConfig } from 'in-settings/tabs/SecurityAndAccess/api/googleSSO';
import renderFallbackLoadingView from 'in-settings/components/ApiItemView/FallbackLoadingView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { UPDATED_OBJECT } from 'in-services/util/constants';
import { close } from 'in-components/DialogPresenter/store';
import { LoadingStatus } from 'in-settings/types';

export function createForm(apiResult?: GoogleSSOConfig | undefined): GoogleSsoMapForm {
  return createMapForm({
    items: {
      filter: createField({
        value: apiResult?.filter
      })
    }
  });
}
const GoogleSSODialog = () => {
  const { form, setForm, loading, errorMessage } = useFormWithObservable({
    observable: getConfigAsResultObservable,
    createForm: createForm
  });
  const { unstable_trackEvent } = useSegmentTracking();
  const [status, setStatus] = useState<LoadingStatus>('inactive');
  const [description, setDescription] = useState('');

  const onSaveGoogleSSOConfig = () => {
    const googleSingleSignOnConfig = { filter: form.get('filter').value };
    const setConfigResult$ = setConfig(googleSingleSignOnConfig);
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
        unstable_trackEvent(UPDATED_OBJECT, { objectType: 'settings.identityProvider.googleSingleSignOn' });
        close();
      },
      error => {
        setDescription(t('in-settings:tabs.failedToSaveConfig', { err: error.message }));
        setStatus('error');
      }
    );
  };
  return (
    <CarbonModal
      size="md"
      open
      modalHeading={t('in-settings:tabs.googleSSO.modalHeading')}
      primaryButtonDisabled={!form?.hierarchyValid || !form.hierarchyTouched || !!errorMessage}
      primaryButtonText={t('in-settings:tabs.save')}
      secondaryButtonText={t('in-settings:tabs.cancel')}
      onRequestSubmit={onSaveGoogleSSOConfig}
      loadingDescription={description}
      loadingStatus={status}
      onSecondarySubmit={close}
      onRequestClose={close}
    >
      {loading && renderFallbackLoadingView()}
      {errorMessage && (
        <CarbonInlineNotification
          kind="error"
          lowContrast
          title={t('in-settings:components.errorTitle')}
          subtitle={errorMessage}
        />
      )}
      {!errorMessage && <GoogleSSOForm form={form} setForm={setForm} />}
    </CarbonModal>
  );
};

export default GoogleSSODialog;
