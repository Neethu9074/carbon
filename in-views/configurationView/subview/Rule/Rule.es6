import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import RuleForm from 'in-views/configurationView/subview/Rule/RuleForm';
import { getRule, saveRule, createRule } from 'in-services/api/rules';
import Section from 'in-views/configurationView/components/Section';
import { openRules } from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';

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
    this.loadRule(this.props.params.ruleId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.ruleId !== nextProps.params.ruleId) {
      this.loadRule(nextProps.params.ruleId);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { form, rule } = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {rule ? `Configure rule: ${rule.get('name')}` : 'Configure rule'}
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

          {form ? <RuleForm form={form} onChange={this.onChange} /> : null}
        </form>

      </SubViewWrapper>
    );
  }

  loadRule = ruleId => {
    this.disposeAsyncAction();

    if (!ruleId) {
      const rule = fromJS(createRule());
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

    const result$ = getRule(ruleId);
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
        updatedForm = updatedForm.updateIn([fieldName[i]], field => field.setValue(value[i]).setTouched(true));
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

    const result$ = saveRule(
      fromJS(
        createRule(
          rule ? rule.get('id') : null,
          form.get('name').value,
          form.get('entityType').value,
          form.get('metricName').value,
          1000, // 1s
          Number(form.get('window').value),
          form.get('aggregation').value,
          form.get('conditionOperator').value,
          Number(form.get('conditionValue').value)
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
  return createMapForm()
    .put(
      'name',
      createField({
        value: rule ? rule.get('name') : '',
        validator: notBlankValidator
      })
    )
    .put(
      'entityType',
      createField({
        value: rule ? rule.get('entityType') : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: rule ? rule.get('metricName') : '',
        validator: metricName => {
          return metricName && metricName != '-1' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid metric.`
                }
              ];
        }
      })
    )
    .put(
      'window',
      createField({
        value: String(rule.get('window')),
        validator: notBlankValidator
      })
    )
    .put(
      'aggregation',
      createField({
        value: rule.get('aggregation'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionOperator',
      createField({
        value: rule.get('conditionOperator'),
        validator: notBlankValidator
      })
    )
    .put(
      'conditionValue',
      createField({
        value: String(rule.get('conditionValue')),
        validator(value) {
          const n = Number(value);
          if (isNaN(n)) {
            return [
              {
                severity: 'error',
                message: 'Please enter a number (use . as a decimal separator).'
              }
            ];
          }
          return null;
        }
      })
    );
}
