import { createLogger } from 'instalog';
import React from 'react';

import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import RuleDetails from 'in-views/configurationView/subview/Rules/components/RuleDetails';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { getRuleLink } from 'in-stores/navigation/configuration';
import { openRule } from 'in-stores/navigation/configuration';
import { getRules, deleteRule } from 'in-services/api/rules';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Button from 'in-components/Button';

const logger = createLogger('Rules');

const cols = [getLinkColumn(getRuleLink), getDeleteButtonColumn()];

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

    // just open the rule dialog without an id will create a new one in the dialog
    openRule();
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

    const rows = rules.toArray().map(rule => {
      return {
        key: rule.get('id'),
        entity: rule,
        onDelete: this.onDeleteRule
      };
    });

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

              <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}

function getRowDetails(row) {
  return <RuleDetails rule={row.entity} />;
}
