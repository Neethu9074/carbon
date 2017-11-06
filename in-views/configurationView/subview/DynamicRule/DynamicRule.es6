import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import { getDynamicRule, saveDynamicRule, createDynamicRule } from 'in-services/api/dynamicRules';
import DynamicRuleForm from 'in-views/configurationView/subview/DynamicRule/DynamicRuleForm';
import Step4 from 'in-views/configurationView/subview/DynamicRule/components/Step4';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { openDynamicRules } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { queryValidator } from 'in-stores/search/validations';
import Notification from 'in-components/form/Notification';
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
    const { form } = this.state;

    return (
      <SubViewWrapper>
        {DashboardNavigationRoute}

        <Title title="Dynamic Rule" />

        <SubViewHeader>Configure dynamic rule</SubViewHeader>

        <form onSubmit={this.onSubmit}>
          {form ? (
            <DynamicRuleForm
              isNewRuleDialog={this.props.match.params.ruleId ? false : true}
              form={form}
              onChange={this.onChange}
              excludeEntity={this.excludeEntity}
              includeEntity={this.includeEntity}
            />
          ) : null}
          <Section>
            {form ? <Step4 form={form} onChange={this.onChange} /> : null}
            {this.state.message ? (
              <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            ) : null}
          </Section>
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

  includeEntity = id => {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['excludedSnapshotIds'], field =>
      field.setValue(field.value.filter(value => value !== id)).setTouched(true)
    );

    this.setState({
      form: this.enrichForm(updatedForm)
    });
  };

  excludeEntity = id => {
    let updatedForm = this.state.form;
    updatedForm = updatedForm.updateIn(['excludedSnapshotIds'], field =>
      field.setValue(field.value.push(id)).setTouched(true)
    );

    this.setState({
      form: this.enrichForm(updatedForm)
    });
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
      form: this.enrichForm(updatedForm)
    });
  };

  enrichForm = form => {
    const matchingEntities = form.get('matchingEntities').value;
    const excludedSnapshotIds = form.get('excludedSnapshotIds').value;
    if (matchingEntities && matchingEntities.snapshots) {
      const selectedEntities = matchingEntities.snapshots.filter(
        snapshot => excludedSnapshotIds.indexOf(snapshot.get('id')) < 0
      );
      form = form.updateIn(['selectedEntities'], field => field.setValue(selectedEntities).setTouched(true));
    }

    return form;
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

    const ruleTest = createDynamicRule(
      rule ? rule.get('id') : null,
      form.get('text').value,
      form.get('enabled').value,
      form.get('entityType').value,
      form.get('metricName').value,
      1000 * 60 * 60, // rollup,
      form.get('query').value,
      Date.now(), // queryEvaluationTimestamp
      'anomaly', // ruleType
      form.get('sensitivity').value,
      form.get('violationDirection').value,
      form.get('triggering').value,
      form.get('severity').value,
      form.get('text').value,
      form.get('description').value,
      1000 * 60 * 60, // expirationTime
      form.get('excludedSnapshotIds').value.toJS()
    );

    const result$ = saveDynamicRule(ruleTest);

    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(openDynamicRules);

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
      'entityType',
      createField({
        value: rule ? rule.getIn(['match', 'entityType']) : undefined,
        validator: notBlankValidator
      })
    )
    .put(
      'metricName',
      createField({
        value: rule ? rule.getIn(['match', 'metricName']) : '',
        validator: metricName => {
          return metricName && metricName != '-1' && metricName.length > 0
            ? null
            : [
                {
                  severity: 'error',
                  message: `Please enter a valid Metric.`
                }
              ];
        }
      })
    )
    .put(
      'query',
      createField({
        value: rule.getIn(['match', 'query']),
        validator: queryValidator
      })
    )
    .put(
      'violationDirection',
      createField({
        value: rule.getIn(['rule', 'violationDirection'], '').toLowerCase()
      })
    )
    .put(
      'sensitivity',
      createField({
        value: rule.getIn(['rule', 'sensitivity'])
      })
    )
    .put(
      'severity',
      createField({
        value: rule.getIn(['event', 'severity'])
      })
    )
    .put(
      'triggering',
      createField({
        value: rule.getIn(['event', 'triggering'])
      })
    )
    .put(
      'text',
      createField({
        value: rule.getIn(['event', 'text']),
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: rule.getIn(['event', 'description'])
      })
    )
    .put(
      'enabled',
      createField({
        value: rule.get('enabled')
      })
    )
    .put(
      'excludedSnapshotIds',
      createField({
        value: rule.getIn(['match', 'excludedSnapshotIds'])
      })
    )
    .put(
      'matchingEntities',
      createField({
        value: null
      })
    )
    .put(
      'selectedEntities',
      createField({
        value: [],
        validator: entities => {
          if (entities.length > 10) {
            return [
              {
                severity: 'error',
                message: `The number of Entities is limited to 10.`
              }
            ];
          }
        }
      })
    )
    .put(
      'timeOpened',
      createField({
        value: Date.now()
      })
    );
}

function setFieldValue(value, field) {
  return field.setValue(value).setTouched(true);
}
