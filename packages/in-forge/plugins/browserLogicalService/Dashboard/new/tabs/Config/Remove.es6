import { get } from 'lodash';
import React from 'react';

import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { websitePath } from 'in-stores/navigation/paths/mainPaths';
import { goToPath } from 'in-stores/navigation/navigation';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { removeKey } from 'in-services/api/eumKeys';
import Button from 'in-components/Button';

import './Remove.less';

const block = 'in-eum-remove';

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
    const { snapshot } = this.props;
    const { removeError, loading } = this.state;

    return (
      <DashboardTile title="Remove Website">
        <p className={`${block}__help`}>
          If you no longer wish to monitor the website <strong>{snapshot.getIn(['data', 'eumKeyName'])}</strong> using
          Instana, please use this form to remove it. Removing a website is an eventually consistent action. For this
          reason, removing a website may take <em>up to a few hours</em> until it has been completely removed.
        </p>
        <p className={`${block}__help`}>
          <strong>Please note that neither you nor the Instana support can undo this action!</strong>
        </p>
        <input type="checkbox" checked={this.state.checkboxChecked} onChange={this.onTickChange} disabled={loading} /> I
        understand that this action cannot be undone.
        {removeError && <SaveError>{removeError}</SaveError>}
        <Button
          kind="danger"
          disabled={loading || !this.state.checkboxChecked}
          onClick={this.remove}
          className={`${block}__remove-button`}
        >
          Remove Website
        </Button>
      </DashboardTile>
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

    this.subscription = combineDataAndError(removeKey(this.props.snapshot.getIn(['data', 'eumKey']))).once(
      ({ error }) => {
        if (error) {
          this.setState({
            loading: false,
            saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
          });
        } else {
          goToPath(websitePath);
        }
      }
    );
  };
}
