import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import { getDynamicRule, saveDynamicRule, createDynamicRule } from 'in-services/api/dynamicRules';
import DynamicRuleForm from 'in-views/configurationView/subview/DynamicRule/DynamicRuleForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { openRules } from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';
import Title from 'in-components/Title';

const logger = createLogger('Rule');

export default class extends React.Component {
  static displayName = 'Rule';

  state = {
    loading: true,
    error: false,
    message: 'Loading rule…',
    form: null,
    rule: null
  };

  componentWillMount() {
    this.loadRule(this.props.match.params.ruleId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.ruleId !== nextProps.match.params.ruleId) {
      this.loadRule(nextProps.match.params.ruleId);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { form, rule } = this.state;

    return (
      <SubViewWrapper>
        <Title title="Dynamic Rule" />

        <SubViewHeader>{rule ? `Configure dynamic rule: ${rule.get('name')}` : 'Configure dynamic rule'}</SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form ? (
              <Button kind="success" type="submit" disabled={!form.hierarchyValid && form.touched}>
                Save
              </Button>
            ) : null}

            {this.state.message ? (
              <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            ) : null}
          </Section>

          {form ? <DynamicRuleForm form={form} onChange={this.onChange} /> : null}
        </form>
      </SubViewWrapper>
    );
  }

  loadRule = ruleId => {
    this.disposeAsyncAction();

    if (!ruleId) {
      const rule = fromJS(createDynamicRule());
      this.setState({
        loading: false,
        error: false,
        message: null,
        rule,
        form: createForm(rule)
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      message: 'Loading rule…',
      form: null
    });

    const result$ = getDynamicRule(ruleId);
    this.responseSubscription = result$.once(rule => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        rule,
        form: createForm(rule)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load rule.'
      });
    });
  };

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  onChange = (fieldName, value) => {
    let updatedForm = this.state.form;
    if (Array.isArray(fieldName)) {
      for (let i = 0, length = fieldName.length; i < length; i++) {
        updatedForm = updatedForm.updateIn([fieldName[i]], setFieldValue.bind(null, value[i]));
      }
    } else {
      updatedForm = updatedForm.updateIn([fieldName], field => field.setValue(value).setTouched(true));
    }

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

    const rule = this.state.rule;
    const form = this.state.form;

    const result$ = saveDynamicRule(
      fromJS(
        createDynamicRule(
          rule ? rule.get('id') : null,
          form.get('name').value,
          form.get('enabled').value,
          form.get('entityType').value,
          form.get('metricName').value,
          form.get('rollup').value,
          form.get('query').value,
          form.get('queryEvaluationTimestamp').value,
          form.get('ruleType').value,
          form.get('sensitivity').value,
          form.get('violationDirection').value,
          form.get('triggering').value,
          form.get('severity').value,
          form.get('text').value,
          form.get('description').value,
          form.get('expirationTime').value
        )
      )
    );

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openRules);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save rule: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function createForm(rule) {
  return createMapForm().put(
    'name',
    createField({
      value: rule ? rule.get('name') : '',
      validator: notBlankValidator
    })
  );
}

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}
