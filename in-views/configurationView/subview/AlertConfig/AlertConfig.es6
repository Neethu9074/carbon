import {createMapForm, createField, notBlankValidator} from 'formalistic';
import {createLogger} from 'instalog';
import {fromJS} from 'immutable';
import React from 'react';

import {getAlert, saveAlert, createAlert} from 'in-services/groundskeeper/alertings';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import AlertForm from 'in-views/configurationView/subview/AlertConfig/AlertForm';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
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
      message: 'Loading alert…',
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
          {alert ? `Configure alert: ${alert.get('name')}` : 'Configure alert'}
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
      message: 'Loading alert…',
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
        message: 'Failed to load alert.'
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
    let updatedForm = this.state.form;
    if (Array.isArray(fieldName)) {
      for (let i = 0, length = fieldName.length; i < length; i++) {
        updatedForm = updatedForm.updateIn([fieldName[i]], field =>
          field.setValue(value[i]).setTouched(true)
        );
      }
    } else {
      updatedForm = updatedForm.updateIn([fieldName], field =>
        field.setValue(value).setTouched(true)
      );
    }

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

    const result$ = saveAlert(fromJS(createAlert(
      alert ? alert.get('id') : null,
      form.get('name').value,
      alert ? alert.get('enabled') : true,
      form.get('entityType').value,
      form.get('metricName').value,
      1000, // 1s
      form.get('query').value,
      Number(form.get('window').value),
      form.get('aggregation').value,
      form.get('threshold').value,
      Number(form.get('thresholdValue').value),
      form.get('triggering').value,
      Number(form.get('severity').value),
      Number(form.get('expirationTime').value),
      form.get('text').value,
      form.get('description').value
    )));

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
  const match = alert.get('match');
  const event = alert.get('event');
  const rule = alert.get('rule');

  return createMapForm()
    .put('name', createField({
      value: alert ? alert.get('name') : '',
      validator: notBlankValidator
    }))
    .put('entityType', createField({
      value: alert ? match.get('entityType') : undefined,
      validator: notBlankValidator
    }))
    .put('metricName', createField({
      value: alert ? match.get('metricName') : '',
      validator: metricName => {
        return (metricName && metricName != '-1' && metricName.length > 0)
          ? null
          : [{
            severity: 'error',
            message: `Please enter a valid metric.`
          }];
        }
    }))
    .put('query', createField({
      value: match.get('query'),
      validator: queryValidator
    }))
    .put('window', createField({
      value: String(rule.get('window')),
      validator: notBlankValidator
    }))
    .put('aggregation', createField({
      value: rule.get('aggregation'),
      validator: notBlankValidator
    }))
    .put('threshold', createField({
      value: rule.get('conditionOperator'),
      validator: notBlankValidator
    }))
    .put('thresholdValue', createField({
      value: String(rule.get('conditionValue')),
      validator: notBlankValidator
    }))
    .put('triggering', createField({
      value: event.get('triggering')
    }))
    .put('severity', createField({
      value: String(event.get('severity')),
      validator: notBlankValidator
    }))
    .put('expirationTime', createField({
      value: String(event.get('expirationTime')),
      validator: notBlankValidator
    }))
    .put('text', createField({
      value: String(event.get('text')),
      validator: notBlankValidator
    }))
    .put('description', createField({
      value: String(event.get('description'))
    }));
}
