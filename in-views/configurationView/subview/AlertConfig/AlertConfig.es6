import {createMapForm, createField, notBlankValidator} from 'formalistic';
import {createLogger} from 'instalog';
import {fromJS} from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import AlertForm from 'in-views/configurationView/subview/AlertConfig/AlertForm';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getAlert, saveAlert} from 'in-services/groundskeeper/alertings';
import {openAlertsConfig} from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import {queryValidator} from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';


const logger = createLogger('alertConfig');

export default React.createClass({
  displayName: 'AlertConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: 'Loading Alert…',
      form: null,
      alert: null
    };
  },

  componentWillMount() {
    this.loadAlert(this.props.params.alertId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.alertId !== nextProps.params.alertId) {
      this.loadAlert(nextProps.params.alertId);
    }
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  render() {
    const {form, alert} = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {alert ? `Configure Alert: ${alert.get('name')}` : 'Configure Alert'}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form ?
              <Button kind='success'
                      type='submit'
                      disabled={!form.hierarchyValid && form.touched}>
                Save
              </Button>
            : null}

            {this.state.message ?
              <Notification failure={this.state.error}
                            loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
          </Section>

          {form ?
            <AlertForm form={form}
                       onChange={this.onChange} />
          : null}
        </form>

      </SubViewWrapper>
    );
  },

  loadAlert(alertId) {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading Alert…',
      form: null,
      role: null
    });

    const result$ = getAlert(alertId);
    this.responseSubscription = result$.once(alert => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        alert,
        form: createForm(alert)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load Alert.'
      });
    });
  },

  disposeAsyncAction() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
      });
      return;
    }

    const alert = this.state.alert;
    const form = this.state.form;

    const result$ = saveAlert(
      fromJS({
        id: alert ? alert.get('id') : null,
        name: form.get('name').value,
        enabled: alert ? alert.get('enabled') : true,
        entityType: form.get('entityType').value,
        metricName: form.get('metricName').value,
        isTriggering: form.get('isTriggering').value,
        rollup: Number(form.get('rollup').value),
        aggregation: form.get('aggregation').value,
        window: Number(form.get('window').value),
        threshold: form.get('threshold').value,
        thresholdValue: Number(form.get('thresholdValue').value),
        severity: Number(form.get('severity').value),
        eventText: form.get('eventText').value,
        description: form.get('description').value,
        query: form.get('query').value,
      })
    );
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openAlertsConfig);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save alert: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  }
});

function createForm(alert) {
  return createMapForm()
    .put('name', createField({
      value: alert ? alert.get('name') : '',
      validator: notBlankValidator
    }))
    .put('entityType', createField({
      value: alert ? alert.get('entityType') : undefined,
      validator: notBlankValidator
    }))
    .put('metricName', createField({
      value: alert ? alert.get('metricName') : '',
      validator: notBlankValidator
    }))
    .put('rollup', createField({
      value: alert ? String(alert.get('rollup')) : undefined,
      validator: notBlankValidator
    }))
    .put('aggregation', createField({
      value: alert ? alert.get('aggregation') : undefined,
      validator: notBlankValidator
    }))
    .put('window', createField({
      value: alert ? String(alert.get('window')) : undefined,
      validator: notBlankValidator
    }))
    .put('threshold', createField({
      value: alert ? alert.get('thresholdOperator') : undefined,
      validator: notBlankValidator
    }))
    .put('thresholdValue', createField({
      value: alert ? String(alert.get('thresholdValue')) : '0.0',
      validator: notBlankValidator
    }))
    .put('eventText', createField({
      value: alert ? String(alert.get('eventText')) : '',
      validator: notBlankValidator
    }))
    .put('description', createField({
      value: alert ? String(alert.get('description')) : ''
    }))
    .put('severity', createField({
      value: alert ? String(alert.get('severity')) : undefined,
      validator: notBlankValidator
    }))
    .put('isTriggering', createField({
      value: alert ? alert.get('isTriggering') : false
    }))
    .put('query', createField({
      value: alert ? alert.get('query') : '',
      validator: queryValidator
    }));
}
