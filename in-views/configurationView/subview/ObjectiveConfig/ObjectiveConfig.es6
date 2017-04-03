import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { fromJS, List } from 'immutable';
import { createLogger } from 'instalog';
import React from 'react';

import { getObjective, saveObjective, createObjective } from 'in-services/api/objectives';
import ObjectiveForm from 'in-views/configurationView/subview/ObjectiveConfig/ObjectiveForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { openObjectivesConfig } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';

const logger = createLogger('ObjectiveConfig');

export default React.createClass({
  displayName: 'ObjectiveConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: 'Loading objective…',
      form: null,
      objective: null
    };
  },

  componentWillMount() {
    this.loadObjective(this.props.params.objectiveId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.objectiveId !== nextProps.params.objectiveId) {
      this.loadObjective(nextProps.params.objectiveId);
    }
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  render() {
    const { form, objective } = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {objective ? `Configure objective: ${objective.get('name')}` : 'Configure objective'}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form
              ? <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
                  Save
                </Button>
              : null}

            {this.state.message
              ? <Notification failure={this.state.error} loading={this.state.loading}>
                  {this.state.message}
                </Notification>
              : null}
          </Section>

          {form
            ? <ObjectiveForm
                form={form}
                onChange={this.onChange}
                onChangeInThresholds={this.onChangeInThresholds}
                onAddThreshold={this.onAddThreshold}
                onRemoveThreshold={this.onRemoveThreshold}
              />
            : null}
        </form>

      </SubViewWrapper>
    );
  },

  loadObjective(objectiveId) {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading objective…',
      form: null,
      role: null
    });

    const result$ = getObjective(objectiveId);
    this.responseSubscription = result$.once(objective => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        objective,
        form: createForm(objective)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load objective.'
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
        updatedForm = updatedForm.updateIn([fieldName[i]], field => field.setValue(value[i]).setTouched(true));
      }
    } else {
      updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    }

    this.setState({
      form: updatedForm
    });
  },

  onAddThreshold() {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['thresholds'], field =>
      field
        .setValue(
          field.value.push(
            fromJS({
              value: 0,
              severity: 0,
              message: ''
            })
          )
        )
        .setTouched(true));

    this.setState({
      form: updatedForm
    });
  },

  onRemoveThreshold(index) {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['thresholds'], field =>
      field.setValue(field.value.delete(index)).setTouched(true));

    this.setState({
      form: updatedForm
    });
  },

  onChangeInThresholds(index, fieldName, value) {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['thresholds'], field =>
      field.setValue(field.value.setIn([index, fieldName], value)).setTouched(true));

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    const objective = this.state.objective;
    const form = this.state.form;

    const result$ = saveObjective(
      fromJS(
        createObjective(
          objective ? objective.get('id') : null,
          form.get('name').value,
          objective ? objective.get('enabled') : true,
          form.get('filteringQuery').value,
          form.get('timePattern').value,
          form.get('timeZoneId').value,
          form.get('reductionOperation').value,
          form.get('thresholds').value.toJS()
        )
      )
    );

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openObjectivesConfig);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save objective: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  }
});

function createForm(objective) {
  const match = objective.get('match');
  const rule = objective.get('rule');

  return createMapForm()
    .put(
      'name',
      createField({
        value: objective ? objective.get('name') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'filteringQuery',
      createField({
        value: match ? match.get('filteringQuery') : '',
        validator: queryValidator
      })
    )
    .put(
      'timePattern',
      createField({
        value: match ? match.get('timePattern') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'timeZoneId',
      createField({
        value: match ? match.get('timeZoneId') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'reductionOperation',
      createField({
        value: rule ? rule.get('reductionOperation') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'thresholds',
      createField({
        value: rule ? rule.get('thresholds') : List(),
        validator: thresholdValidator
      })
    );
}

function thresholdValidator(thresholds) {
  const messages = {
    values: [],
    severity: [],
    message: []
  };

  thresholds.forEach((threshold, i) => {
    const value = threshold.get('value');

    const isValueValid = !isNaN(value) && value % 1 === 0 && value >= 0 && value !== '';
    if (!isValueValid) {
      messages.values[i] = ['The value must be an integer >= 0'];
    }

    const messageError = notBlankValidator(threshold.get('message'));
    if (messageError.length > 0) {
      messages.message[i] = [];
      messageError.forEach(error => messages.message[i].push(error.message));
    }

    const severityError = notBlankValidator(String(threshold.get('severity')));
    if (severityError.length > 0) {
      messages.severity[i] = [];
      severityError.forEach(error => messages.severity[i].push(error.message));
    }
  });

  return [
    {
      severity: messages.values.length + messages.message.length + messages.severity.length === 0 ? null : 'error',
      messages
    }
  ];
}
