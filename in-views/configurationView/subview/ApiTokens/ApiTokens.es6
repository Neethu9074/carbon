import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import { getApiTokens, saveApiToken, deleteApiToken } from 'in-services/api/apiTokens';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import { getApiTokenConfigLink } from 'in-stores/navigation/configuration';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { openApiTokenConfig } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { generateUniqueShortId } from 'in-services/util/id';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Button from 'in-components/Button';

const logger = createLogger('ApiTokenManagement');

const cols = [getLinkColumn(getApiTokenConfigLink), getDeleteButtonColumn()];

export default class extends React.Component {
  static displayName = 'ApiTokens';

  state = {
    loading: true,
    error: false,
    message: null,
    apiTokens: emptyList,
    selectedToken: null
  };

  componentWillMount() {
    this.refreshApiTokens();
  }

  refreshApiTokens = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading API tokens…'
    });

    const result$ = getApiTokens();
    this.responseSubscription = result$.once(apiTokens => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        apiTokens
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      logger.error(`Failed to retrieve API tokens: ${error.message}`, error);
      this.setState({
        error: true,
        loading: false,
        message: 'Failed to retrieve API tokens.'
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

  render() {
    const { apiTokens } = this.state;

    let sortedApiTokens;
    if (apiTokens) {
      sortedApiTokens = apiTokens.toArray().sort((a, b) => a.get('name').localeCompare(b.get('name')));
    }

    const rows = sortedApiTokens.map(apiToken => {
      return {
        key: apiToken.get('id'),
        entity: apiToken,
        onDelete: this.onDelete
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>
          API Tokens
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewApiToken}>
            Add API Token
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
        </Section>
        <Table cols={cols} rows={rows} />
      </SubViewWrapper>
    );
  }

  addNewApiToken = () => {
    const newApiToken = Map({
      id: generateUniqueShortId(),
      name: 'New API Token'
    });

    this.setState({
      error: false,
      loading: true,
      message: 'Adding new API token…'
    });

    const result$ = saveApiToken(newApiToken);
    this.responseSubscription = result$.once(() => {
      openApiTokenConfig(newApiToken.get('id'));
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save new API token: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  onDelete = apiToken => {
    setActiveDialog(
      <ConfirmationDialog
        header="Confirm removal"
        description={
          <span>
            Are you sure you want to remove the API token <strong>{apiToken.get('name')}</strong>?
          </span>
        }
        bButtonLabel="Remove API token"
        onB={() => {
          close();
          this.onDeleteAfterConfirmation(apiToken);
        }}
      />
    );
  };

  onDeleteAfterConfirmation = apiToken => {
    this.setState({
      error: false,
      loading: true,
      message: `Removing API token ${apiToken.get('name')}`
    });

    const result$ = deleteApiToken(apiToken.get('id'));
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        apiTokens: this.state.apiTokens.filter(eachApiToken => eachApiToken.get('id') !== apiToken.get('id'))
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove API token ${apiToken.get('name')}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };
}
