/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField } from 'formalistic';
import React, { Fragment } from 'react';

import { createLogger } from '@instana/logger';
import { Toggle } from '@instana/components';

import HumioForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm';
import { teamSettingsLogManagementHumio } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { integrationKey } from 'in-integrations/logging/humio/consts';
import { refresh } from 'in-integrations/logging/configurationsStore';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const block = 'in-ui-config';

const logger = createLogger('humioConfig');

export default class Humio extends React.Component {
  static displayName = 'Humio';

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
        message: t('in-settings:tabs.failedToLoadHumioConfiguration')
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
        <Title title={t('in-settings:tabs.configureHumio')} />
        <SubViewHeader>{t('in-settings:tabs.configureYourHumioSettings')}</SubViewHeader>
        <SectionLine />
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                <HorizontalFormGroup helpText={t('in-settings:tabs.enableDisableHumioIntegrationForInstana')}>
                  <Heading text={t('in-settings:tabs.showHumioLinkOnHostsContainersAndPods')} htmlFor="humio-enabled" />
                  <Toggle
                    id="humio-enabled"
                    checked={enabled}
                    onChange={e => this.onChange('enabled', e.target.checked)}
                  />
                </HorizontalFormGroup>
              </div>
            </Fragment>

            <HumioForm form={form} onChange={this.onChange} areFieldsBlank={areFieldsBlank(form)} disabled={!enabled} />

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

    const result$ = save(this.state.form.toJS());
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
      goToPath(teamSettingsLogManagementHumio);
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
