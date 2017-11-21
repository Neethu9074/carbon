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

  render() {
    const { entities } = this.state;
    const entitiesAvailable = entities && entities.size > 0;

    const rows = entities.toArray().map(entity => {
      return {
        key: entity.get('id'),
        entity: entity,
        onDelete: this.onDelete
      };
    });

    return (
      <SubViewWrapper>
        <Title title={this.props.title} />
        <SubViewHeader>{this.props.title}</SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRule}>
            Add New
          </Button>
          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>

        {entitiesAvailable ? (
          <Section>
            <SectionHeading>{this.props.title}</SectionHeading>

            <Table cols={this.props.cols} rows={rows} getRowDetails={this.props.getRowDetails} />
          </Section>
        ) : null}
      </SubViewWrapper>
    );
  }
}
