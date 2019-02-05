import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { create, combineLatest } from 'reactive-observables';
import { fromJS, List } from 'immutable';
import { createLogger } from 'instalog';
import React from 'react';

import {
  combinedValidationResults,
  queryValidationResultValidator,
  queryValidationInProgressValidator,
  valid
} from 'in-settings/validation';
import CustomIssueForm from 'in-settings/tabs/TeamSettings/pages/knowledgeManagement/CustomIssues/CustomIssueForm';
import { teamSettingsKnowledgeManagementCustomIssues } from 'in-settings/navigation/paths';
import { getRuleBinding, saveRuleBinding, createRuleBinding } from 'in-api/ruleBindings';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { isBlank, isNotBlank } from 'in-services/util/string';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import { validate } from 'in-api/search';
import { getRules } from 'in-api/rules';
import Title from 'in-components/Title';

const logger = createLogger('CustomIssue');

export default class extends React.Component {
  static displayName = 'CustomIssue';

  queryInput = create();

  state = {
    loading: true,
    error: false,
    message: 'Loading custom issue…',
    form: null,
    ruleBinding: null,
    rules: null
  };

  componentWillMount() {
    this.loadCustomIssue(this.props.match.params.id);

    const debouncedQuery = this.queryInput.debounce(1000);
    this.matchingEntitesSubscription = debouncedQuery
      .flatMap(query => {
        return combineLatest([
          validate({ query, newApplicationModelEnabled: false }),
          validate({ query, newApplicationModelEnabled: true })
        ]);
      })
      .subscribe(([validationResponse10, validationResponse20]) => {
        this.onChange(
          'validationResult',
          combinedValidationResults(validationResponse10.body, validationResponse20.body)
        );
        this.onChange('queryValidationInProgress', false);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.loadCustomIssue(nextProps.match.params.id);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
    if (this.matchingEntitesSubscription) {
      this.matchingEntitesSubscription.dispose();
      this.matchingEntitesSubscription = null;
    }
  }

  render() {
    const { form, ruleBinding, rules, message, loading, isCreate } = this.state;

    return (
      <SettingsDetailPage>
        <Title title="Custom Issue" />

        <SubViewHeader>
          {isCreate
            ? 'Create Custom Issue'
            : ruleBinding
              ? `Configure Custom Issue: ${ruleBinding.get('text')}`
              : 'Configure Custom Issue'}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          {this.state.message ? (
            <Section>
              <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            </Section>
          ) : null}

          {form ? (
            <CustomIssueForm
              form={form}
              rules={rules}
              onChange={this.onChange}
              onChangeInRuleIds={this.onChangeInRuleIds}
              onChangeApplyOn={this.onChangeApplyOn}
              queryValidationInProgress={getValueOrNull(form, 'queryValidationInProgress')}
            />
          ) : null}

          {form ? (
            <SaveCancel
              form={form}
              message={message}
              loading={loading}
              isCreate={isCreate}
              listPath={teamSettingsKnowledgeManagementCustomIssues}
            />
          ) : null}
        </form>
      </SettingsDetailPage>
    );
  }

  loadCustomIssue = id => {
    this.disposeAsyncAction();

    if (!id) {
      const ruleBinding = fromJS(createRuleBinding());
      this.setState({
        isCreate: true
      });
      this.responseSubscription = getRules().once(rules => {
        this.setState({
          loading: false,
          error: false,
          message: null,
          ruleBinding,
          rules,
          form: createForm(ruleBinding, true)
        });
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      message: 'Loading custom issue…',
      form: null
    });

    const ruleResult$ = getRules();
    const ruleBindingResult$ = getRuleBinding(id);
    const result$ = combineLatest([ruleBindingResult$, ruleResult$]);
    this.responseSubscription = result$.once(([ruleBinding, rules]) => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        ruleBinding,
        rules,
        form: createForm(ruleBinding, false)
      });
      this.emitQueryIfNotBlank(ruleBinding.get('query', ''));
    });

    this.errorSubscription = combineLatest([ruleResult$.errors(), ruleBindingResult$.errors()]).once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load custom issue.'
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

  emitQueryIfNotBlank = query => {
    if (isNotBlank(query)) {
      this.queryInput.emit(query);
    } else {
      if (this.state.form.containsKey('query')) {
        this.onChange('validationResult', valid());
        this.onChange('queryValidationInProgress', false);
      }
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

    if (fieldName == 'query') {
      updatedForm = startValidationInProgress(updatedForm);
      this.emitQueryIfNotBlank(value);
    }

    this.setState({
      form: updatedForm
    });
  };

  onChangeApplyOn = applyOn => {
    if (!applyOn) {
      return;
    }
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['applyOn'], field => field.setValue(applyOn).setTouched(true));
    if (applyOn === 'all') {
      updatedForm = updatedForm.remove('query');
    } else {
      updatedForm = putQueryFields(updatedForm, '');
    }
    this.setState({
      form: updatedForm
    });
  };

  onChangeInRuleIds = newRuleId => {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['ruleIds'], field =>
      field.setValue(field.value.setIn([0], newRuleId)).setTouched(true)
    );
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

    const ruleBinding = this.state.ruleBinding;
    const form = this.state.form;

    // the query field might not exist in case 'Apply on ALL' is selected,
    // which corresponds to an empty query
    const query = form.containsKey('query') ? form.get('query').value : '';

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
          query,
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
    this.responseSubscription = result$.once(() => goToPath(teamSettingsKnowledgeManagementCustomIssues));

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save custom issue: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function getValueOrNull(form, key) {
  return form.containsKey(key) ? form.get(key).value : null;
}

function startValidationInProgress(form) {
  const query = getValueOrNull(form, 'query');
  if (isBlank(query)) {
    return form;
  }
  // hide previous error message
  let updatedForm = form.updateIn(['validationResult'], field =>
    field.setValue({ valid: true, error: null }).setTouched(false)
  );
  // show progress indicator
  updatedForm = updatedForm.updateIn(['queryValidationInProgress'], field => field.setValue(true).setTouched(false));
  return updatedForm;
}

function createForm(ruleBinding, isCreate) {
  const query = ruleBinding.get('query');
  // always set to 'Dynamic Focus Query' per default for new configs, so that
  // the user manually has to select 'All' in case he really want that
  const applyOn = isCreate || isNotBlank(query) ? 'dfq' : 'all';

  let form = createMapForm()
    .put(
      'severity',
      createField({
        value: String(ruleBinding.get('severity')),
        validator: severity => {
          if (Number(severity) === 0) {
            return [
              {
                severity: 'error',
                message: `Please select a severity`
              }
            ];
          }
          return null;
        }
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
      'ruleIds',
      createField({
        value: ruleBinding ? ruleBinding.get('ruleIds') : List(),
        validator: ruleIdsValidator
      })
    )
    .put(
      'applyOn',
      createField({
        value: applyOn,
        validator: notBlankValidator
      })
    );

  if (applyOn === 'dfq') {
    form = putQueryFields(form, query);
  }

  return form;
}

function putQueryFields(form, query) {
  let updatedForm = form.put(
    'query',
    createField({
      value: query,
      validator: notBlankValidator
    })
  );
  updatedForm = updatedForm.put(
    'validationResult',
    createField({
      value: valid(),
      validator: queryValidationResultValidator
    })
  );
  updatedForm = updatedForm.put(
    'queryValidationInProgress',
    createField({
      value: false,
      validator: queryValidationInProgressValidator
    })
  );
  return updatedForm;
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

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}
