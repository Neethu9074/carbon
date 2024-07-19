/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { createLogger } from '@instana/logger';
import { Select } from '@instana/components';

// to suppress warning on deprecated code temporarily
// eslint-disable-next-line import/no-deprecated
import { goToPath } from 'in-stores/navigation';
import IntegrationsBreadcumb from 'in-settings/tabs/TeamSettings/pages/logManagement/Integrations/IntegrationsBreadcrumb';
import { ibmCloudDefaultBaseURL, logMezmoDefaultBaseURL } from 'in-integrations/logging/mezmo/LinkConstruction';
import IbmCloudLogMezmoForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Mezmo/IbmCloudMezmoForm';
import MezmoSaasForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Mezmo/MezmoSaasForm';
import { validMezmoId } from 'in-settings/tabs/TeamSettings/pages/logManagement/Mezmo/validation';
import useFormSideEffects, { CHANGE_TYPES } from 'in-hooks/useFormSideEffects';
import { teamSettingsLogManagementMezmo } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { integrationKey } from 'in-integrations/logging/mezmo/consts';
import { refresh } from 'in-integrations/logging/configurationsStore';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { get, save } from 'in-integrations/logging/api';
import { Col, Row } from 'in-components/layout/Grid';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './MezmoForm.mless';

const block = 'in-ui-config';

const logger = createLogger('mezmoConfig');

export default function Mezmo() {
  const [form, setForm] = useState(null);
  const [integration, setIntegration] = useState(null);
  const [saving, setSaving] = useState({ responseSubscription: null, errorSubscription: null, saving: false });
  const [message, setMessage] = useState(t('in-settings:tabs.loading'));
  const [loading, setLoading] = useState(true);
  const updateForm = useMezmoFormSideEffects(form, setForm, integration);

  useEffect(() => {
    if (form === null) {
      const result$ = get();
      let responseSubscription = result$.once(integrations => {
        const integration = integrations.find(i => i.type === integrationKey);
        setForm(createForm(integration));
        setIntegration(integration);
        setMessage(undefined);
        setLoading(false);
      });
      let errorSubscription = result$.errors().once(() => {
        setLoading(false);
        setMessage(t('in-settings:tabs.failedToLoadMezmoConfiguration'));
      });
      return () => {
        responseSubscription.dispose();
        errorSubscription.dispose();
        disposeAsyncAction();
      };
    } else {
      return () => disposeAsyncAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const enabled = form?.get('enabled').value ?? null;

  function disposeAsyncAction() {
    if (saving.responseSubscription) {
      saving.responseSubscription.dispose();
    }

    if (saving.errorSubscription) {
      saving.errorSubscription.dispose();
    }
    setSaving({ responseSubscription: null, errorSubscription: null, saving: saving.saving });
  }

  const onChange = (fieldName, value) => {
    updateForm(form.updateIn([fieldName], field => field.setValue(value).setTouched(true)));
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!form.hierarchyValid) {
      updateForm(form.setTouched(true, { recurse: true }));
      return;
    }

    let data = form.toJS();
    const result$ = save(data);
    disposeAsyncAction();
    setMessage(t('in-settings:tabs.saving'));

    let responseSubscription = result$.once(savedIntegration => {
      refresh();
      setSaving(false);
      setIntegration(savedIntegration);
      // to suppress warning on deprecated code temporarily
      // eslint-disable-next-line import/no-deprecated
      goToPath(teamSettingsLogManagementMezmo);
    });

    let errorSubscription = result$.errors().once(error => {
      const message = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
      logger.error(message, error);
      setSaving({ responseSubscription: null, errorSubscription: null, saving: false });
      setMessage(message);
    });

    setSaving({ responseSubscription: responseSubscription, errorSubscription: errorSubscription, saving: true });
  };

  return (
    <section className={locals.page}>
      <Title title={t('in-settings:tabs.configureMezmo')} />
      <IntegrationsBreadcumb />
      <SubViewHeader>{t('in-settings:tabs.configureYourMezmoSettings')}</SubViewHeader>
      <SectionLine />
      {form && (
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <HorizontalFormGroup helpText={t('in-settings:tabs.enableDisableMezmoIntegrationForInstana')}>
              <Heading text={t('in-settings:tabs.showMezmoLinkOnHosts')} htmlFor="logdn-enabled" />
            </HorizontalFormGroup>
          </div>
          {form.get('instanceType').map(field => (
            <Row>
              <Col xs={2}>
                <FormGroup>
                  <Label htmlFor="mezmo-selected-instance" hasError={enabled && !field.valid && field.touched}>
                    {t('in-settings:tabs.mezmoInstance')}
                  </Label>
                  <Select
                    id="mezmo-selected-instance"
                    value={field.value}
                    onChange={e => onChange('instanceType', e.target.value)}
                    disabled={!enabled}
                  >
                    <option value="LOG_DNA_SAAS">Mezmo</option>
                    <option value="IBM_CLOUD">IBM Cloud Log Analysis</option>
                  </Select>
                  {enabled && <TouchedMessages field={field} />}
                </FormGroup>
              </Col>
            </Row>
          ))}
          {form.get('instanceType').value === 'LOG_DNA_SAAS' ? (
            <MezmoSaasForm
              form={form}
              onChange={onChange}
              areFieldsInvalid={areFieldsInvalid(form)}
              disabled={!enabled}
            />
          ) : (
            <IbmCloudLogMezmoForm
              form={form}
              onChange={onChange}
              areFieldsInvalid={areFieldsInvalid(form)}
              disabled={!enabled}
            />
          )}

          <SaveCancel
            form={form}
            message={message}
            loading={loading || saving.saving}
            hasCancelButton={false}
            saveEnabled={!enabled || !areFieldsInvalid(form)}
          />
        </form>
      )}
    </section>
  );
}

function createForm(integration) {
  function getBaseUrlValue() {
    if (integration?.baseUrl) {
      return integration.baseUrl;
    } else if (integration?.instanceType === 'IBM_CLOUD') {
      return ibmCloudDefaultBaseURL;
    }
    return logMezmoDefaultBaseURL;
  }

  return createMapForm()
    .put(
      'type',
      createField({
        value: integrationKey
      })
    )
    .put(
      'accountId',
      createField({
        value: integration ? integration['accountId'] : '',
        validator: validMezmoId
      })
    )
    .put(
      'baseUrl',
      createField({
        value: getBaseUrlValue(),
        validator: notBlankValidator
      })
    )
    .put(
      'instanceType',
      createField({
        value: integration && integration['instanceType'] ? integration['instanceType'] : 'LOG_DNA_SAAS'
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

function areFieldsInvalid(form) {
  return !form.get('accountId').valid || !form.get('baseUrl').valid;
}

function useMezmoFormSideEffects(form, setForm, integration) {
  const effects = [
    {
      path: ['instanceType'],
      effects: [updateBaseUrl]
    }
  ];

  return useFormSideEffects({
    form,
    setForm,
    effects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.INSERT]
  });

  function updateBaseUrl(form) {
    let savedInstance = integration?.instanceType;
    let formInstance = form.get('instanceType').value;
    if (formInstance === savedInstance) {
      return form.updateIn(['baseUrl'], f => f.setValue(integration['baseUrl']));
    } else if (formInstance === 'LOG_DNA_SAAS') {
      return form.updateIn(['baseUrl'], f => f.setValue(logMezmoDefaultBaseURL));
    } else if (formInstance === 'IBM_CLOUD') {
      return form.updateIn(['baseUrl'], f => f.setValue(ibmCloudDefaultBaseURL));
    }
  }
}
