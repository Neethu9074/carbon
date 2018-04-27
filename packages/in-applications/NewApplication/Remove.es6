import { get } from 'lodash';
import React from 'react';

import HelpParagraph from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/HelpParagraph';
import { deleteApplicationConfig } from 'in-api/applicationConfigs';
import { applicationsList } from 'in-applications/navigation/paths';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { goToPath } from 'in-stores/navigation';
import Card from 'in-new-components/Card';
import Button from 'in-components/Button';

import locals from './Remove.less';

export default class Remove extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkboxChecked: false,
      removeError: null,
      loading: false
    };
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }

  render() {
    const { application } = this.props;
    if (!application) {
      return null;
    }

    const { removeError, loading } = this.state;

    return (
      <Card title="Remove Application">
        <HelpParagraph>
          If you no longer wish to monitor the application <strong>{application.label}</strong> using Instana, please
          use this form to remove it. Removing an application is an eventually consistent action. For this reason,
          removing an application may take <em>up to a few minutes</em> until it has been completely removed.
        </HelpParagraph>
        <HelpParagraph>
          <strong>Please note that neither you nor the Instana support can undo this action!</strong>
        </HelpParagraph>
        <input type="checkbox" checked={this.state.checkboxChecked} onChange={this.onTickChange} disabled={loading} /> I
        understand that this action cannot be undone.
        {removeError && <SaveError>{removeError}</SaveError>}
        <Button
          kind="danger"
          disabled={loading || !this.state.checkboxChecked}
          onClick={this.remove}
          className={locals.removeButton}
        >
          Remove Application
        </Button>
      </Card>
    );
  }

  onTickChange = e => {
    this.setState({ checkboxChecked: e.target.checked });
  };

  remove = e => {
    e.preventDefault();

    this.setState({
      loading: true,
      removeError: null
    });

    this.subscription = combineDataAndError(deleteApplicationConfig(this.props.application.id)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        goToPath(applicationsList);
      }
    });
  };
}
