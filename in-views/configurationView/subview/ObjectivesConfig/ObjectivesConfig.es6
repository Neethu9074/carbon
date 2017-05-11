import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import { createObjective, getObjectives, saveObjective, deleteObjective, setEnabled } from 'in-services/api/objectives';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import SavingToggle from 'in-views/configurationView/components/SavingToggle';
import DeleteButton from 'in-views/configurationView/components/DeleteButton';
import { getObjectivesConfigLink } from 'in-stores/navigation/configuration';
import { openObjectiveConfig } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { formatDateTime } from 'in-services/formatters/date';
import { compareIgnoreCase } from 'in-services/util/string';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import Button from 'in-components/Button';

import './ObjectivesConfig.less';

const block = 'in-objective-form';
const logger = createLogger('ObjectivesConfig');

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        return getObjectivesConfigLink(row.key).map(href => {
          return {
            value: row.objective.get('name'),
            content: <Link href={href} objectiveName={row.objective.get('name')} />
          };
        });
      }
    }
  },
  {
    title: 'Enabled',
    type: 'custom',
    typeArgs: {
      comparator: (a, b) => b.enabled - a.enabled,
      get(row) {
        return always({
          value: row.objective.get('enabled', false),
          content: (
            <SavingToggle
              checked={row.objective.get('enabled', false)}
              onChange={value => row.setEnabled(row.objective, value)}
              status={row.status}
            />
          )
        });
      }
    }
  },
  {
    title: '',
    type: 'custom',
    typeArgs: {
      comparator: () => 0,
      get(row) {
        return always({
          value: 0,
          content: <DeleteButton itemName={row.objective.get('name')} onDelete={() => row.onDeleteObjective(row.key)} />
        });
      }
    }
  }
];

export default class extends React.Component {
  static displayName = 'ObjectivesConfig';

  state = {
    loading: true,
    error: false,
    message: null,
    objectives: emptyList,
    status: {}
  };

  componentWillMount() {
    this.refresObjectives();
  }

  refresObjectives = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading objectives…'
    });

    const result$ = getObjectives();
    this.responseSubscription = result$.once(objectives => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        objectives
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve objectives: ${error.message}`;
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

  addNewObjective = () => {
    this.disposeAsyncAction();

    const newObjective = Map(createObjective());

    this.setState({
      error: false,
      loading: true,
      message: 'Adding new objective…'
    });

    const result$ = saveObjective(newObjective);
    this.responseSubscription = result$.once(() => {
      openObjectiveConfig(newObjective.get('id'));
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save new objective: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  onDeleteObjective = objectiveId => {
    this.setState({
      error: false,
      loading: true,
      message: `Removing objective ${objectiveId}`
    });

    const result$ = deleteObjective(objectiveId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        objectives: this.state.objectives.filter(eachObjective => eachObjective.get('id') !== objectiveId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove objective ${objectiveId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  setEnabled = (objective, enabled) => {
    const previousEnabled = objective.get('enabled');
    const objectiveId = objective.get('id');

    this.setState(state => {
      state.status[objectiveId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving objective…'
      };

      const index = state.objectives.findIndex(eachObjective => objectiveId === eachObjective.get('id'));
      const newObjectives = state.objectives.update(index, modifiableObjectives =>
        modifiableObjectives.set('enabled', enabled)
      );
      return {
        status: state.status,
        objectives: newObjectives
      };
    });

    const result$ = setEnabled(objective, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[objectiveId] = {
          state: 'success',
          time: Date.now(),
          message: 'Objective change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set objectives enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[objectiveId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.objectives.findIndex(eachObjective => objectiveId === eachObjective.get('id'));
        const newObjectives = state.objectives.update(index, modifiableObjectives =>
          modifiableObjectives.set('enabled', previousEnabled)
        );
        return {
          status: state.status,
          objectives: newObjectives
        };
      });
    });
  };

  render() {
    const { objectives } = this.state;
    const objectivesAvailable = objectives && objectives.size > 0;

    const rows = objectives.toArray().map(objective => {
      return {
        key: objective.get('id'),
        objective: objective,
        onDeleteObjective: this.onDeleteObjective,
        setEnabled: this.setEnabled,
        status: this.state.status[objective.get('id')]
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Objective Management
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewObjective}>
            Add New Objective
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
        </Section>

        {objectivesAvailable
          ? <Section>
              <SectionHeading>
                Objectives
              </SectionHeading>

              <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}

function getRowDetails(row) {
  const objective = row.objective;
  const match = objective.get('match');
  const rule = objective.get('rule');
  let reductionOperation = rule.get('reductionOperation', '');
  if (reductionOperation === 'totalCount') {
    reductionOperation = 'Total events count';
  } else if (reductionOperation === 'totalDuration') {
    reductionOperation = 'Total events duration';
  }

  return (
    <div className={`${block}__details-wrapper`}>
      <DescriptionList>
        <DescriptionItem title="Applied on filter query">
          {match.get('filteringQuery')}
        </DescriptionItem>
        <DescriptionItem title="Time pattern">
          {match.get('timePattern')}
        </DescriptionItem>
        <DescriptionItem title="Time zone">
          {rule.get('timeZoneId')}
        </DescriptionItem>

        <DescriptionItem title="Reduction operation">
          {reductionOperation}
        </DescriptionItem>
        <DescriptionItem title="Thresholds">
          <ul className={`${block}__thresholds`}>
            {rule.get('thresholds').map((threshold, i) => (
              <li key={i} className={`${block}__flex-wrapper`}>
                <DescriptionItem title="Value" className={`${block}__value`}>
                  {threshold.get('value')}
                </DescriptionItem>
                <DescriptionItem title="Severity" className={`${block}__severity`}>
                  {mapSeverityToLabel(threshold.get('severity'))}
                </DescriptionItem>
                <DescriptionItem title="Message">
                  {threshold.get('message')}
                </DescriptionItem>
              </li>
            ))}
          </ul>
        </DescriptionItem>

        <DescriptionItem title="Last update">
          {formatDateTime(objective.get('lastUpdated'))}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}

function Link({ href, objectiveName }) {
  return (
    <a href={href}>
      {objectiveName}
    </a>
  );
}

function mapSeverityToLabel(severity) {
  if (severity === 0) {
    return 'change';
  } else if (severity === 5) {
    return 'warning';
  } else {
    return 'critical';
  }
}
