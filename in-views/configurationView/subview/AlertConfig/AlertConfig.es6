import {createMapForm, createField, notBlankValidator} from 'formalistic';
import {fromJS} from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import AlertForm from 'in-views/configurationView/subview/AlertConfig/AlertForm';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getAlert, addOrUpdateAlert} from 'in-services/groundskeeper/alertings';
import {openAlertstConfig} from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import {queryValidator} from 'in-stores/search/validations';
import Button from 'in-components/Button';


export default React.createClass({
  displayName: 'AlertConfig',

  getInitialState() {
    return {
      error: false,
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

  render() {
    const {form, alert} = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {alert ? `Configure Alert: ${alert.getIn(['data', 'name'])}` : 'Configure Alert'}
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
    const alert = getAlert(alertId);
    this.setState({
      alert,
      form: createForm(alert)
    });
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
    addOrUpdateAlert(fromJS({
      id: alert ? alert.get('id') : null,
      data: {
        name: form.get('name').value,
        enabled: alert ? alert.getIn(['data', 'enabled']) : true,
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
      }
    }));

    openAlertstConfig();
  }
});

function createForm(alert) {
  return createMapForm()
    .put('name', createField({
      value: alert ? alert.getIn(['data', 'name']) : '',
      validator: notBlankValidator
    }))
    .put('entityType', createField({
      value: alert ? alert.getIn(['data', 'entityType']) : undefined,
      validator: notBlankValidator
    }))
    .put('metricName', createField({
      value: alert ? alert.getIn(['data', 'metricName']) : '',
      validator: notBlankValidator
    }))
    .put('rollup', createField({
      value: alert ? String(alert.getIn(['data', 'rollup'])) : undefined,
      validator: notBlankValidator
    }))
    .put('aggregation', createField({
      value: alert ? alert.getIn(['data', 'aggregation']) : undefined,
      validator: notBlankValidator
    }))
    .put('window', createField({
      value: alert ? String(alert.getIn(['data', 'window'])) : undefined,
      validator: notBlankValidator
    }))
    .put('threshold', createField({
      value: alert ? alert.getIn(['data', 'threshold']) : undefined,
      validator: notBlankValidator
    }))
    .put('thresholdValue', createField({
      value: alert ? String(alert.getIn(['data', 'thresholdValue'])) : '0.0',
      validator: notBlankValidator
    }))
    .put('eventText', createField({
      value: alert ? String(alert.getIn(['data', 'eventText'])) : '',
      validator: notBlankValidator
    }))
    .put('description', createField({
      value: alert ? String(alert.getIn(['data', 'description'])) : ''
    }))
    .put('severity', createField({
      value: alert ? String(alert.getIn(['data', 'severity'])) : undefined,
      validator: notBlankValidator
    }))
    .put('isTriggering', createField({
      value: alert ? alert.getIn(['data', 'isTriggering']) : false
    }))
    .put('query', createField({
      value: alert ? alert.getIn(['data', 'query']) : '',
      validator: queryValidator
    }));
}
