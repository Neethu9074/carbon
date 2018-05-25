import { get } from 'lodash';
import React from 'react';

import HelpParagraph from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Config/HelpParagraph';
import { deleteServiceConfig } from 'in-api/serviceConfiguration';
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
      <Card title="Remove Service Rule">
        <HelpParagraph>
          If you no longer wish to apply a custom rule to extract services, please use the button below to remove it.
          Removing an application may take up to a few minutes.
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
          Remove Rule
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

    this.subscription = combineDataAndError(deleteServiceConfig(this.props.serviceConfig.id)).once(({ error }) => {
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
