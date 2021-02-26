/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField } from 'formalistic';
import { createLogger } from '@instana/logger';
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import ElkForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Elk/ElkForm';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { teamSettingsLogManagementElk } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { refresh } from 'in-integrations/logging/configurationsStore';
import { integrationKey } from 'in-integrations/logging/elk/consts';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

const block = 'in-ui-config';

const logger = createLogger('elkConfig');

export default class Elk extends React.Component {
  static displayName = 'ELK';

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
        message: t('in-settings:tabs.failedToLoadElkConfiguration')
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
        <Title title={t('in-settings:tabs.configureElk')} />
        <SubViewHeader>{t('in-settings:tabs.configureYourElkSettings')}</SubViewHeader>
        <SectionLine />
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                <HorizontalFormGroup helpText={t('in-settings:tabs.enableDisableElkIntegrationForInstana')}>
                  <Heading text={t('in-settings:tabs.showElkLinkOnHostsContainersAndPods')} htmlFor="elk-enabled" />
                  <Toggle
                    id="elk-enabled"
                    checked={enabled}
                    onChange={e => this.onChange('enabled', e.target.checked)}
                  />
                </HorizontalFormGroup>
              </div>
            </Fragment>

            <ElkForm form={form} onChange={this.onChange} areFieldsBlank={areFieldsBlank(form)} disabled={!enabled} />

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
      goToPath(teamSettingsLogManagementElk);
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save configuration: ${error.message}`;
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
      'basePath',
      createField({
        value: integration ? integration['basePath'] : ''
      })
    )
    .put(
      'dashboard',
      createField({
        value: integration ? integration['dashboard'] : ''
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
  return isBlank(form.get('url').value) || isBlank(form.get('dashboard').value);
}
