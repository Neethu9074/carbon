import { createMapForm, createField } from 'formalistic';
import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import ServiceExtractionEndpointRuleConfigSubForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionEndpointRuleConfigSubForm';
import {
  getServiceRule,
  saveServiceRule,
  createServiceRule,
  createEndpointRule
} from 'in-services/api/serviceExtraction';
import ServiceExtractionRuleConfigForm
  from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/ServiceExtractionRuleConfigForm';
import { typeDefinitions } from 'in-views/configurationView/subview/ServiceExtractionRuleConfig/types';
import { openServiceExtractionConfigByDefinition } from 'in-stores/navigation/configuration';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';

const logger = createLogger('ServiceExtractionRuleConfig');

export default class extends React.Component {
  static displayName = 'ServiceExtractionRuleConfig';

  state = {
    loading: true,
    error: false,
    message: 'Loading service extraction rule…',
    form: null,
    rule: null
  };

  componentWillMount() {
    this.loadServiceExtractionRule(this.props.params.ruleId);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.ruleId !== nextProps.params.ruleId) {
      this.loadServiceExtractionRule(nextProps.params.ruleId);
    }
  }

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  render() {
    const { form, rule } = this.state;
    const { helpTexts, matchSpecificationOptionsTree, matchSpecificationOptions } = typeDefinitions[
      this.props.params.ruleType
    ];

    return (
      <div>
        <SubViewWrapper>
          <SubViewHeader>
            {rule ? `Configure service extraction rule: ${rule.get('name')}` : 'Configure service extraction rule'}
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
              ? <ServiceExtractionRuleConfigForm
                  prePath={[]}
                  ruleForm={form}
                  helpTexts={helpTexts}
                  matchSpecificationOptionsTree={matchSpecificationOptionsTree}
                  matchSpecificationOptions={matchSpecificationOptions}
                  onChangeIn={this.onChangeIn}
                  addMatchSpecification={this.addMatchSpecification}
                  removeMatchSpecification={this.removeMatchSpecification}
                />
              : null}
          </form>

        </SubViewWrapper>

        <ServiceExtractionEndpointRuleConfigSubForm
          serviceRule={rule}
          form={form}
          onChangeIn={this.onChangeIn}
          helpTexts={helpTexts}
          matchSpecificationOptionsTree={matchSpecificationOptionsTree}
          matchSpecificationOptions={matchSpecificationOptions}
          addMatchSpecification={this.addMatchSpecification}
          removeMatchSpecification={this.removeMatchSpecification}
          removeEndpointRule={this.removeEndpointRule}
          addEndpointRule={this.addEndpointRule}
        />
      </div>
    );
  }

  loadServiceExtractionRule = ruleId => {
    this.disposeAsyncAction();

    if (!ruleId) {
      let rule = createServiceRule({});
      rule.type = this.props.params.ruleType;
      rule = fromJS(rule);

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
      message: 'Loading service extraction rule…',
      form: null
    });

    const result$ = getServiceRule(ruleId);
    this.responseSubscription = result$.once(_rule => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        rule: _rule,
        form: createForm(_rule)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: 'Failed to load service extraction rule.'
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

  onChangeIn = (path, value) => {
    this.setState({
      form: this.state.form.updateIn(path, field => field.setValue(value).setTouched(true))
    });
  };

  addMatchSpecification = (path, matchName, initialValue) => {
    const field = createField({ value: initialValue, validator: matchSpecificationMustCompileRule });
    this.setState({
      form: this.state.form.updateIn(path, item => item.put(matchName, field).setTouched(true))
    });
  };

  removeMatchSpecification = (key, path) => {
    this.setState({
      form: this.state.form.updateIn(path, item => item.remove(key).setTouched(true))
    });
  };

  addEndpointRule = () => {
    const endpointRule = fromJS(createEndpointRule({}));
    const ruleForm = createEndpointRuleForm(endpointRule);
    this.setState({
      form: this.state.form.updateIn(['endpointRules'], item =>
        item.put(endpointRule.get('id'), ruleForm).setTouched(true)
      )
    });
  };

  removeEndpointRule = key => {
    this.setState({
      form: this.state.form.updateIn(['endpointRules'], item => item.remove(key).setTouched(true))
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

    const endpointKeys = form.get('endpointRules').reduce((acc, cur, key) => acc.concat(key), []).sort();
    const endpoints = [];
    for (let i = 0, length = endpointKeys.length; i < length; i++) {
      const endpointForm = form.get('endpointRules').get(endpointKeys[i]);
      endpoints.push(
        createEndpointRule({
          id: endpointForm.get('id').value,
          name: endpointForm.get('name').value,
          enabled: form.get('enabled').value,
          comment: endpointForm.get('comment').value,
          matchSpecification: getMatchSpecifications(endpointForm),
          label: endpointForm.get('label').value
        })
      );
    }

    const result$ = saveServiceRule(
      fromJS(
        createServiceRule({
          id: rule ? rule.get('id') : null,
          order: rule.get('order'),
          type: this.props.params.ruleType,

          name: form.get('name').value,
          enabled: form.get('enabled').value,
          comment: form.get('comment').value,
          matchSpecification: getMatchSpecifications(form),
          endpointRules: endpoints,
          label: form.get('label').value
        })
      )
    );

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(() =>
      openServiceExtractionConfigByDefinition(typeDefinitions[this.props.params.ruleType])
    );

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save service extraction rule: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function getMatchSpecifications(form) {
  const matchSpecificationKeys = form.get('matchSpecification').reduce((acc, cur, key) => acc.concat(key), []).sort();
  const matchSpecifications = {};
  for (let i = 0, length = matchSpecificationKeys.length; i < length; i++) {
    matchSpecifications[matchSpecificationKeys[i]] = form
      .get('matchSpecification')
      .get(matchSpecificationKeys[i]).value;
  }
  return matchSpecifications;
}

function createForm(rule) {
  let form = createBasicRuleForm(rule);

  const endpointRules = rule.get('endpointRules');
  if (endpointRules) {
    endpointRules.forEach(endpoint => {
      form = form.updateIn(['endpointRules'], item => item.put(endpoint.get('id'), createEndpointRuleForm(endpoint)));
    });
  }
  return form;
}

function createEndpointRuleForm(endpoint) {
  return createBasicRuleForm(endpoint);
}

function createBasicRuleForm(rule) {
  let form = createMapForm()
    .put('id', createField({ value: rule.get('id') }))
    .put('name', createField({ value: rule.get('name') || '' }))
    .put('enabled', createField({ value: rule.get('enabled', true) }))
    .put('comment', createField({ value: rule.get('comment') || '' }))
    .put('matchSpecification', createMapForm({ validator: atLeastOneMatchSpecificationRule }))
    .put('endpointRules', createMapForm())
    .put('label', createField({ value: rule.getIn(['extractSpecification', 'label'], 'Unnamed service') }));

  const matchSpecifications = rule.get('matchSpecification');
  if (matchSpecifications) {
    Object.keys(matchSpecifications.toJS()).forEach(key => {
      form = form.updateIn(['matchSpecification'], item =>
        item.put(
          key,
          createField({
            value: matchSpecifications.get(key),
            validator: matchSpecificationMustCompileRule
          })
        )
      );
    });
  }
  return form;
}

function atLeastOneMatchSpecificationRule(mapForm) {
  if (Object.keys(mapForm).length === 0) {
    return atLeastOneMatchResult;
  }
  return null;
}

const atLeastOneMatchResult = [
  {
    severity: 'error',
    message: 'At least one match expression is required.'
  }
];

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}

function matchSpecificationMustCompileRule(regex) {
  try {
    /* eslint-disable no-new */
    new RegExp(regex);
    /* eslint-enable no-new */
    return null;
  } catch (e) {
    return [
      {
        severity: 'error',
        message: e.message
      }
    ];
  }
}
