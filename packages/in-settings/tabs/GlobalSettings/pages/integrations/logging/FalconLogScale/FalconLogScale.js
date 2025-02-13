/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable import/no-deprecated */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createMapForm, createField } from 'formalistic';

import { Typography } from '@instana/components';
import { createLogger } from '@instana/logger';

import IntegrationsBreadcumb from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/IntegrationsBreadcrumb';
import FalconLogScaleForm from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/FalconLogScale/FalconLogScaleForm';
import { callToastFlyout } from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Integrations/utils';
import { globalSettingsIntegrationsLoggingFalconLogScale } from 'in-settings/navigation/paths';
import { integrationKey } from 'in-integrations/logging/falconLogScale/consts';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { refresh } from 'in-integrations/logging/configurationsStore';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './FalconLogScaleForm.mless';

const block = 'in-ui-config';

//This should be renamed to Falcon LogScale
const logger = createLogger('humioConfig');

const FalconLogScale = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(t('in-settings:tabs.loading'));
  const [form, setForm] = useState(null);
  const { goToPath } = useNavigation();
  const [isFormSave, setIsFormSave] = useState(false);
  const responseSubscriptionRef = useRef(null);
  const errorSubscriptionRef = useRef(null);

  const disposeAsyncAction = useCallback(() => {
    if (responseSubscriptionRef.current) {
      responseSubscriptionRef.current.dispose();
      responseSubscriptionRef.current = null;
    }

    if (errorSubscriptionRef.current) {
      errorSubscriptionRef.current.dispose();
      errorSubscriptionRef.current = null;
    }
  }, []);

  const loadConfiguration = useCallback(() => {
    disposeAsyncAction();
    setLoading(true);
    setMessage(t('in-settings:tabs.loading'));
    setForm(null);

    const result$ = get();

    responseSubscriptionRef.current = result$.once(integrations => {
      const integration = integrations.find(i => i.type === integrationKey);
      setLoading(false);
      setMessage(null);
      setForm(createForm(integration));
    });

    errorSubscriptionRef.current = result$.errors().once(() => {
      setLoading(false);
      setMessage(t('in-settings:tabs.failedToLoadFalconLogScaleConfiguration'));
    });
  }, [disposeAsyncAction]);

  useEffect(() => {
    loadConfiguration();
    return () => disposeAsyncAction();
  }, [loadConfiguration, disposeAsyncAction]);

  const saveIntegrationForm = useCallback(() => {
    const result$ = save(form.toJS());
    disposeAsyncAction();
    setLoading(true);
    setMessage(t('in-settings:tabs.saving'));

    responseSubscriptionRef.current = result$.once(() => {
      refresh();
      setLoading(false);
      const content = (
        <section>
          <Typography variant="heading-200">{t('in-settings:tabs.integrations.toastSuccessTitle')}</Typography>
          <Typography variant="body-regular">
            {t('in-settings:tabs.integrations.toastSuccessMessage', { integrationType: 'Falcon LogScale' })}
          </Typography>
        </section>
      );
      callToastFlyout('success', content);
      goToPath(globalSettingsIntegrationsLoggingFalconLogScale);
    });

    errorSubscriptionRef.current = result$.errors().once(error => {
      const errorMessage = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
      logger.error(errorMessage, error);
      const content = (
        <section>
          <Typography variant="heading-200">{t('in-settings:tabs.integrations.toastErrorTitle')}</Typography>
          <Typography variant="body-regular">
            {t('in-settings:tabs.integrations.integrationConfigurationFailed', { error: errorMessage })}
          </Typography>
        </section>
      );
      callToastFlyout('error', content);
      setLoading(false);
      setMessage(errorMessage);
    });
  }, [disposeAsyncAction, form, goToPath]);

  useEffect(() => {
    if (isFormSave) {
      saveIntegrationForm();
      setIsFormSave(false);
    }
  }, [isFormSave, saveIntegrationForm]);

  const onChange = (fieldName, value) => {
    setForm(prevForm => prevForm.updateIn([fieldName], field => field.setValue(value).setTouched(true)));
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!form.hierarchyValid) {
      setForm(prevForm => prevForm.setTouched(true, { recurse: true }));
      return;
    }

    setForm(prevForm => {
      const updatedForm = prevForm.updateIn(['enabled'], field =>
        field.value ? field : field.setValue(true).setTouched(true)
      );
      setIsFormSave(true);
      return updatedForm;
    });
  };

  const enabled = form ? form.get('enabled').value : null;

  return (
    <section className={locals.page}>
      <Title title={t('in-settings:tabs.configureFalconLogScale')} />
      <IntegrationsBreadcumb />
      <SubViewHeader>{t('in-settings:tabs.configureYourFalconLogScaleSettings')}</SubViewHeader>
      {form && (
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Heading
              text={t('in-settings:tabs.showFalconLogScaleLinkOnHostsContainersAndPods')}
              htmlFor="falconLogScale-enabled"
            />
          </div>
          <SectionLine />

          <FalconLogScaleForm
            id={'falconLogScale-enabled'}
            form={form}
            onChange={onChange}
            areFieldsBlank={areFieldsBlank(form)}
            disabled={!enabled}
          />

          <SaveCancel
            form={form}
            message={message}
            loading={loading}
            hasCancelButton={false}
            saveEnabled={!areFieldsBlank(form)}
            type="integration"
          />
        </form>
      )}
    </section>
  );
};

export default FalconLogScale;

function createForm(integration) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: integrationKey
      })
    )
    .put(
      'url',
      createField({
        value: integration ? integration['url'] : ''
      })
    )
    .put(
      'repository',
      createField({
        value: integration ? integration['repository'] : ''
      })
    )
    .put(
      'enabled',
      createField({
        value: integration ? integration['enabled'] : true
      })
    );
}

function Heading({ text, htmlFor }) {
  return (
    <Label className={`${block}__label`} htmlFor={htmlFor}>
      {text}
    </Label>
  );
}

function areFieldsBlank(form) {
  return isBlank(form.get('url').value) || isBlank(form.get('repository').value);
}
