import { createMapForm, createField } from 'formalistic';
import React, { Fragment } from 'react';
import { createLogger } from '@instana/logger';

import SplunkForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Splunk/SplunkForm';
import { teamSettingsLogManagementSplunk } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { integrationKey } from 'in-integrations/logging/splunk/consts';
import { refresh } from 'in-integrations/logging/configurationsStore';
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

const logger = createLogger('splunkConfig');

export default class Splunk extends React.Component {
  static displayName = 'Splunk';

  state = {
    loading: true,
    error: false,
    message: 'Loading…',
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
      message: 'Loading…',
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
        message: 'Failed to load Splunk configuration.'
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
        <Title title="Configure Splunk" />
        <SubViewHeader>{'Configure your Splunk settings'}</SubViewHeader>
        <SectionLine />
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                <HorizontalFormGroup helpText="Enable/Disable Splunk integration for Instana">
                  <Heading text="Show Splunk link on Hosts, Containers and Pods" htmlFor="splunk-enabled" />
                  <Toggle
                    id="splunk-enabled"
                    checked={enabled}
                    onChange={e => this.onChange('enabled', e.target.checked)}
                  />
                </HorizontalFormGroup>
              </div>
            </Fragment>

            <SplunkForm
              form={form}
              onChange={this.onChange}
              areFieldsBlank={areFieldsBlank(form)}
              disabled={!enabled}
            />

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
      message: 'Saving…'
    });

    this.responseSubscription = result$.once(() => {
      refresh();
      this.setState({
        loading: false
      });
      goToPath(teamSettingsLogManagementSplunk);
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
      'index',
      createField({
        value: integration ? integration['index'] : ''
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
  return isBlank(form.get('url').value);
}
