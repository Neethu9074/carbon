import { createMapForm, createField, notBlankValidator } from 'formalistic';
import React, { Fragment } from 'react';

import HumioForm from 'in-settings/tabs/TeamSettings/pages/logManagement/Humio/HumioForm';
import { teamSettingsLogManagementHumio } from 'in-settings/navigation/paths';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { integrationKey } from 'in-integrations/logging/humio/consts';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { generateUniqueShortId } from 'in-services/util/id';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
const block = 'in-ui-config';

const logger = createLogger('humioConfig');

export default class Humio extends React.Component {
  static displayName = 'Humio';

  state = {
    loading: true,
    error: false,
    message: null,
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
      message: 'Loading configuration…',
      id: id,
      form: null,
      integration: null
    });

    const result$ = get();

    this.responseSubscription = result$.once(integrations => {
      const integration = integrations.find(i => i.name === integrationKey);
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
        message: 'Failed to load Humio configuration.'
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
    if (!form) {
      return null;
    }

    const enabled = form.get('enabled').value;

    return (
      <SettingsDetailPage>
        <Title title="Humio" />

        <SubViewHeader>{'Configure your Humio settings'}</SubViewHeader>
        <form onSubmit={this.onSubmit}>
          <Fragment>
            <div style={{ marginBottom: '1rem' }}>
              <HorizontalFormGroup helpText="Enable/Disable Humio integration for Instana">
                <Heading text="Show Humio link on Hosts, Containers and Pods" htmlFor="humio-enabled" />
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
            saveEnabled={!enabled || !areFieldsBlank(form)}
            hasCancelButton={false}
          />
        </form>
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

    const result$ = save(
      fromJS({
        id: this.state.integration && this.state.integration.id ? this.state.integration.id : generateUniqueShortId(),
        url: this.state.form.get('url').value,
        repository: this.state.form.get('repository').value,
        enabled: this.state.form.get('enabled').value,
        name: integrationKey
      })
    );

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });

    this.responseSubscription = result$.once(() => {
      this.setState({
        loading: false
      });
      goToPath(teamSettingsLogManagementHumio);
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
      'url',
      createField({
        value: integration ? integration['url'] : '',
        validator: notBlankValidator
      })
    )
    .put(
      'repository',
      createField({
        value: integration ? integration['repository'] : '',
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
  return isBlank(form.get('url').value) || isBlank(form.get('repository').value);
}
