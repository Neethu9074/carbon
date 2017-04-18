import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import { createRule, getRules, saveRule, deleteRule } from 'in-services/api/rules';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Table from 'in-views/configurationView/subview/Rules/components/Table';
import Section from 'in-views/configurationView/components/Section';
import { openRule } from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import { close } from 'in-components/DialogPresenter/store';
import { emptyList } from 'in-services/fixedImmutables';
import Button from 'in-components/Button';

const logger = createLogger('Rules');

export default class extends React.Component {
  static displayName = 'Rules';

  state = {
    loading: true,
    error: false,
    message: null,
    rules: emptyList,
    status: {}
  };

  componentWillMount() {
    this.refreshRules();
  }

  refreshRules = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading rules…'
    });

    const result$ = getRules();
    this.responseSubscription = result$.once(rules => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        rules
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve rules: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  addNewRule = () => {
    this.disposeAsyncAction();

    const newRule = Map(createRule());

    this.setState({
      error: false,
      loading: true,
      message: 'Adding new rule…'
    });

    const result$ = saveRule(newRule);
    this.responseSubscription = result$.once(() => {
      openRule(newRule.get('id'));
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save new rule: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  onDeleteRule = ruleId => {
    this.setState({
      error: false,
      loading: true,
      message: `Removing rule ${ruleId}`
    });

    const result$ = deleteRule(ruleId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        rules: this.state.rules.filter(eachRule => eachRule.get('id') !== ruleId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove rule ${ruleId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  render() {
    const { rules } = this.state;
    const rulesAvailable = rules && rules.size > 0;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Rules
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRule}>
            Add New Rule
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
        </Section>

        {rulesAvailable
          ? <Section>
              <SectionHeading>
                Custom rule
              </SectionHeading>

              <Table items={rules} onDeleteRule={this.onDeleteRule} status={this.state.status} />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}
