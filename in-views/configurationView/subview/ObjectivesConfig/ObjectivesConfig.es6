import {createLogger} from 'instalog';
import {Map} from 'immutable';
import React from 'react';

import {createObjective, getObjectives, saveObjective, deleteObjective, setEnabled} from 'in-services/groundskeeper/objectives';
import Table from 'in-views/configurationView/subview/ObjectivesConfig/components/Table';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {openObjectiveConfig} from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import {close} from 'in-components/DialogPresenter/store';
import {emptyList} from 'in-services/fixedImmutables';
import Button from 'in-components/Button';


const logger = createLogger('ObjectivesConfig');

export default React.createClass({
  displayName: 'ObjectivesConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      objectives: emptyList,
      status: {}
    };
  },

  componentWillMount() {
    this.refresObjectives();
  },

  refresObjectives() {
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
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  disposeAsyncAction() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  },

  addNewObjective() {
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
  },

  onDeleteObjective(objectiveId) {
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
  },

  setEnabled(objective, enabled) {
    const previousEnabled = objective.get('enabled');
    const objectiveId = objective.get('id');

    this.setState(state => {
      state.status[objectiveId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving objective…'
      };

      const index = state.objectives.findIndex(eachObjective => objectiveId === eachObjective.get('id'));
      const newObjectives = state.objectives.update(index, modifiableObjectives => modifiableObjectives.set('enabled', enabled));
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
        const newObjectives = state.objectives.update(index, modifiableObjectives => modifiableObjectives.set('enabled', previousEnabled));
        return {
          status: state.status,
          objectives: newObjectives
        };
      });
    });
  },

  render() {
    const {objectives} = this.state;
    const objectivesAvailable = objectives && objectives.size > 0;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Objective Management
        </SubViewHeader>

        <Section>
          <Button kind='info'
                  onClick={this.addNewObjective}>
            Add New Objective
          </Button>

          {this.state.message ?
            <Notification failure={this.state.error}
                          loading={this.state.loading}>
              {this.state.message}
            </Notification>
          : null}
        </Section>

        {objectivesAvailable ?
          <Section>
            <SectionHeading>
              Objectives
            </SectionHeading>

            <Table items={objectives}
                   onDeleteObjective={this.onDeleteObjective}
                   setEnabled={this.setEnabled}
                   status={this.state.status} />
          </Section>
        : null}
      </SubViewWrapper>
    );
  }
});
