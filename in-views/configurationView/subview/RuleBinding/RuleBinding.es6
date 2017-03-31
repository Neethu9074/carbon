import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { combineLatest } from 'reactive-observables';
import { fromJS, List } from 'immutable';
import { createLogger } from 'instalog';
import React from 'react';

import { getRuleBinding, saveRuleBinding, createRuleBinding } from 'in-services/groundskeeper/ruleBindings';
import RuleBindingForm from 'in-views/configurationView/subview/RuleBinding/RuleBindingForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { openRuleBindings } from 'in-stores/navigation/configuration';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
import { getRules } from 'in-services/groundskeeper/rules';
import Button from 'in-components/Button';

const logger = createLogger('RuleBinding');

export default React.createClass({
  displayName: 'RuleBinding',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: 'Loading custom issue…',
      form: null,
      ruleBinding: null,
      rules: null
    };
  },

  componentWillMount() {
    this.loadRuleBinding(this.props.params.ruleBindingId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.ruleBindingId !== nextProps.params.ruleBindingId) {
      this.loadRuleBinding(nextProps.params.ruleBindingId);
    }
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  render() {
    const { form, ruleBinding, rules } = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {ruleBinding ? `Configure custom issue: ${ruleBinding.get('text')}` : 'Configure custom issue'}
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
            ? <RuleBindingForm
                form={form}
                rules={rules}
                onChange={this.onChange}
                onChangeInRuleIds={this.onChangeInRuleIds}
              />
            : null}
        </form>

      </SubViewWrapper>
    );
  },

  loadRuleBinding(ruleBindingId) {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading custom issue…',
      form: null
    });

    const ruleResult$ = getRules();
    const ruleBindingResult$ = getRuleBinding(ruleBindingId);
    const result$ = combineLatest([ruleBindingResult$, ruleResult$]);
    this.responseSubscription = result$.once(([ruleBinding, rules]) => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        ruleBinding,
        rules,
        form: createForm(ruleBinding)
      });
    });

    this.errorSubscription = combineLatest([ruleResult$.errors(), ruleBindingResult$.errors()]).once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load custom issue.'
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

  onChangeInRuleIds(newRuleId) {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['ruleIds'], field =>
      field.setValue(field.value.setIn([0], newRuleId)).setTouched(true));
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

    const ruleBinding = this.state.ruleBinding;
    const form = this.state.form;

    const result$ = saveRuleBinding(
      fromJS(
        createRuleBinding(
          ruleBinding ? ruleBinding.get('id') : null,
          ruleBinding ? ruleBinding.get('enabled') : true,
          form.get('triggering').value,
          Number(form.get('severity').value),
          form.get('text').value,
          form.get('description').value,
          Number(form.get('expirationTime').value),
          form.get('query').value,
          form.get('ruleIds').value.toJS()
        )
      )
    );

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openRuleBindings);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save custom issue: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  }
});

function createForm(ruleBinding) {
  return createMapForm()
    .put(
      'severity',
      createField({
        value: String(ruleBinding.get('severity')),
        validator: notBlankValidator
      })
    )
    .put(
      'triggering',
      createField({
        value: ruleBinding.get('triggering')
      })
    )
    .put(
      'expirationTime',
      createField({
        value: String(ruleBinding.get('expirationTime')),
        validator: notBlankValidator
      })
    )
    .put(
      'text',
      createField({
        value: String(ruleBinding.get('text')),
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: String(ruleBinding.get('description'))
      })
    )
    .put(
      'query',
      createField({
        value: ruleBinding.get('query'),
        validator: queryValidator
      })
    )
    .put(
      'ruleIds',
      createField({
        value: ruleBinding ? ruleBinding.get('ruleIds') : List(),
        validator: ruleIdsValidator
      })
    );
}

function ruleIdsValidator(rules) {
  if (rules.size === 0) {
    return [
      {
        severity: 'error',
        message: `Please select a rule`
      }
    ];
  }
  const error = notBlankValidator(rules.get(0));
  if (error.length > 0) {
    return [
      {
        severity: 'error',
        message: error[0].message
      }
    ];
  }
  return null;
}
