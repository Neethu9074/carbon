/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { Fragment } from 'react';

import { createLogger } from '@instana/logger';
import { Toggle } from '@instana/components';

import IbmCloudLogDnaForm from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/IbmCloudLogDnaForm';
import LogDnaSaasForm from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/LogDnaSaasForm';
import { teamSettingsLogManagementLogDna } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { integrationKey } from 'in-integrations/logging/logdna/consts';
import { refresh } from 'in-integrations/logging/configurationsStore';
import { notBlankValidator } from 'in-services/validators/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { get, save } from 'in-integrations/logging/api';
import { Col, Row } from 'in-components/layout/Grid';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const block = 'in-ui-config';

const logger = createLogger('logdnaConfig');

export default class LogDna extends React.Component {
  static displayName = 'LogDNA';

  state = {
    loading: true,
    error: false,
    message: t('in-settings:tabs.loading'),
    integration: null,
    form: null
  };

  componentDidMount() {
    this.loadConfiguration();
  }

  loadConfiguration = id => {
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.loading'),
      id: id,
      form: null,
      integration: null
    });

    const result$ = get();

    this.responseSubscription = result$.once(integrations => {
      const integration = integrations.find(i => i.type === integrationKey);
      this.setState({
        loading: false,
        error: false,
        message: null,
        integration,
        form: createForm(integration)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: t('in-settings:tabs.failedToLoadLogDnaConfiguration')
      });
    });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  render() {
    const { form, message, loading } = this.state;
    const enabled = form ? form.get('enabled').value : null;

    return (
      <SettingsDetailPage>
        <Title title={t('in-settings:tabs.configureLogDna')} />
        <SubViewHeader>{t('in-settings:tabs.configureYourLogDnaSettings')}</SubViewHeader>
        <SectionLine />
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                <HorizontalFormGroup helpText={t('in-settings:tabs.enableDisableLogDnaIntegrationForInstana')}>
                  <Heading text={t('in-settings:tabs.showLogDnaLinkOnHosts')} htmlFor="logdn-enabled" />
                  <Toggle
                    id="logdna-enabled"
                    checked={enabled}
                    onChange={e => this.onChange('enabled', e.target.checked)}
                  />
                </HorizontalFormGroup>
              </div>
            </Fragment>
            {form.get('instanceType').map(field => (
              <Row>
                <Col xs={2}>
                  <FormGroup>
                    <Label htmlFor="logdna-selected-instance" hasError={enabled && !field.valid && field.touched}>
                      {t('in-settings:tabs.logDnaInstance')}
                    </Label>
                    <Select
                      id="logdna-selected-instance"
                      value={field.value}
                      onChange={e => this.onChange('instanceType', e.target.value)}
                    >
                      <option value="LOG_DNA_SAAS">LogDna SaaS</option>
                      <option value="IBM_CLOUD">IBM Cloud Log Analysis</option>
                    </Select>
                    {enabled && <TouchedMessages field={field} />}
                  </FormGroup>
                </Col>
              </Row>
            ))}
            {form.get('instanceType').value === 'LOG_DNA_SAAS' ? (
              <LogDnaSaasForm
                form={form}
                onChange={this.onChange}
                areFieldsBlank={areFieldsBlank(form)}
                disabled={!enabled}
              />
            ) : (
              <IbmCloudLogDnaForm
                form={form}
                onChange={this.onChange}
                areFieldsBlank={areFieldsBlank(form)}
                disabled={!enabled}
              />
            )}

            <SaveCancel
              form={form}
              message={message}
              loading={loading}
              hasCancelButton={false}
              saveEnabled={!enabled || !areFieldsBlank(form)}
            />
          </form>
        )}
      </SettingsDetailPage>
    );
  }

  onChange = (fieldName, value) => {
    const updatedForm = this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    this.setState({
      form: updatedForm
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    let data = this.state.form.toJS();

    const result$ = save(data);
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.saving')
    });

    this.responseSubscription = result$.once(() => {
      refresh();
      this.setState({
        loading: false
      });
      goToPath(teamSettingsLogManagementLogDna);
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function createForm(integration) {
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
        value: integration ? integration['accountId'] : ''
      })
    )
    .put(
      'instanceType',
      createField({
        value: integration && integration['instanceType'] ? integration['instanceType'] : 'LOG_DNA_SAAS',
        validator: notBlankValidator
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
  return isBlank(form.get('accountId').value);
}
