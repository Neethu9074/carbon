import { createLogger } from 'instalog';
import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';
import Title from 'in-components/Title';

const logger = createLogger('Rules');

export default class extends React.Component {
  static displayName = 'BasicEntitiesOverview';

  state = {
    loading: true,
    error: false,
    message: null,
    entities: emptyList,
    status: {}
  };

  componentWillMount() {
    this.refresh();
  }

  refresh = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading…'
    });

    const result$ = this.props.getEntities();
    this.responseSubscription = result$.once(entities => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        entities
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve data: ${error.message}`;
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

    // just open the entity dialog without an id will create a new one in the dialog
    this.props.openEntityConfiguration();
  };

  onDelete = entity => {
    const entityId = entity.get('id');
    this.setState({
      error: false,
      loading: true,
      message: `Removing ${entityId}`
    });

    const result$ = this.props.deleteEntity(entityId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        entities: this.state.entities.filter(eachEntity => eachEntity.get('id') !== entityId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove ${entityId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  setEnabled = (entity, enabled) => {
    const previousEnabled = this.props.getEnabledState ? this.props.getEnabledState(entity) : entity.get('enabled');
    const entityId = entity.get('id');

    this.setState(state => {
      state.status[entityId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving…'
      };

      // optimistic write
      const index = state.entities.findIndex(each => entityId === each.get('id'));
      const newEntities = state.entities.update(
        index,
        modifiable =>
          this.props.setEnabledState
            ? this.props.setEnabledState(modifiable, enabled)
            : modifiable.set('enabled', enabled)
      );
      return {
        status: state.status,
        entities: newEntities
      };
    });

    const result$ = this.props.setEnabled(entity, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[entityId] = {
          state: 'success',
          time: Date.now(),
          message: 'Successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set the enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[entityId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back optimistic write
        const index = state.entities.findIndex(each => entityId === each.get('id'));
        const newEntities = state.entities.update(
          index,
          modifiable =>
            this.props.setEnabledState
              ? this.props.setEnabledState(modifiable, previousEnabled)
              : modifiable.set('enabled', previousEnabled)
        );
        return {
          status: state.status,
          entities: newEntities
        };
      });
    });
  };

  render() {
    const { entities } = this.state;
    const entitiesAvailable = entities && entities.size > 0;

    const rows = entities
      .toArray()
      .filter(item => item)
      .map(entity => {
        return {
          key: entity.get('id'),
          entity: entity,
          onDelete: this.onDelete,
          setEnabled: this.setEnabled
        };
      });

    let AddNewButton = (
      <Button kind="info" onClick={this.addNewRule}>
        Add New
      </Button>
    );
    if (this.props.getAddNewButtonDisabledMessage) {
      const message = this.props.getAddNewButtonDisabledMessage(rows);
      if (message) {
        AddNewButton = (
          <Tooltip content={message} align="rightMiddle">
            <Button disabled kind="info" onClick={this.addNewRule}>
              Add New
            </Button>
          </Tooltip>
        );
      }
    }

    return (
      <SubViewWrapper>
        <Title title={this.props.title} />
        <SubViewHeader>{this.props.title}</SubViewHeader>

        <Section>
          {AddNewButton}
          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>

        {entitiesAvailable ? (
          <Section>
            <SectionHeading>{this.props.title}</SectionHeading>

            <Table
              cols={this.props.cols}
              rows={rows}
              getRowDetails={this.props.getRowDetails}
              maxItemsPerPage={this.props.maxItemsPerPage}
            />
          </Section>
        ) : null}
      </SubViewWrapper>
    );
  }
}
