import { createLogger } from 'instalog';
import React, { Fragment } from 'react';

import { getLinkColumn, getEnableToggleColumn } from 'in-views/configurationView/components/tableColumnPresets';
import RuleBuiltInDetails from 'in-views/configurationView/subview/RulesBuiltIn/components/RuleBuiltInDetails';
import { builtInRulePath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { getBuiltInRules, setBuiltInRuleEnabled } from 'in-api/rules';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import PluginIcon from 'in-components/PluginIcon';
import { compare } from 'in-services/util/string';
import { getSingular } from 'in-sdk/pluginName';
import Title from 'in-components/Title';

const logger = createLogger('RulesBuiltIn');

const cols = [
  getLinkColumn(getEntityIdPath.bind(null, builtInRulePath)),
  {
    title: 'Entity Type',
    type: 'custom',
    width: 150,
    typeArgs: {
      comparator: compare,
      get(row) {
        const entityType = row.entityType;
        return {
          value: entityType,
          content: (
            <Fragment>
              <PluginIcon dimension={16} color="#000" plugin={entityType} />
              &nbsp;&nbsp;
              {getSingular(entityType)}
            </Fragment>
          )
        };
      }
    }
  },
  getEnableToggleColumn()
];

export default class extends React.Component {
  static displayName = 'RulesBuiltIn';

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

    const result$ = getBuiltInRules();
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

  setEnabled = (rule, enabled) => {
    const previousEnabled = rule.get('enabled');
    const ruleId = rule.get('id');

    this.setState(state => {
      state.status[ruleId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving built-in rule…'
      };

      const index = state.rules.findIndex(eachRule => ruleId === eachRule.get('id'));
      const newRules = state.rules.update(index, r => r.set('enabled', enabled));
      return {
        status: state.status,
        rules: newRules
      };
    });

    const result$ = setBuiltInRuleEnabled(ruleId, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[ruleId] = {
          state: 'success',
          time: Date.now(),
          message: 'Rule change successfully saved.'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set enabled flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[ruleId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the change
        const index = state.rules.findIndex(eachRule => ruleId === eachRule.get('id'));
        const newRules = state.rules.update(index, r => r.set('enabled', previousEnabled));
        return {
          status: state.status,
          rules: newRules
        };
      });
    });
  };

  render() {
    const { rules } = this.state;
    const rulesAvailable = rules && rules.size > 0;

    const rows = rules.toArray().map(rule => {
      return {
        key: rule.get('id'),
        entity: rule,
        entityType: rule.get('shortPluginId'),
        setEnabled: this.setEnabled
      };
    });

    return (
      <SubViewWrapper>
        <Title title="Built-in Rules" />
        <SubViewHeader>Rules</SubViewHeader>

        {this.state.message ? (
          <Section>
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          </Section>
        ) : null}

        {rulesAvailable ? (
          <Section>
            <SectionHeading>Built-in Rules</SectionHeading>

            <Table cols={cols} rows={rows} getRowDetails={getRowDetails} maxItemsPerPage={15} />
          </Section>
        ) : null}
      </SubViewWrapper>
    );
  }
}

function getRowDetails(row) {
  return <RuleBuiltInDetails rule={row.entity} />;
}
