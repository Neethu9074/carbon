import React, { Fragment } from 'react';
import { get } from 'lodash';

import { deleteServiceConfig } from 'in-api/serviceConfiguration';
import DescriptionText from 'in-components/form/DescriptionText';
import { servicesList } from 'in-applications/navigation/paths';
import Spacer from 'in-applications/Forms/components/Spacer';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { goToPath } from 'in-stores/navigation';
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
    const { serviceConfig } = this.props;
    if (!serviceConfig) {
      return null;
    }

    const { removeError, loading } = this.state;

    return (
      <Fragment>
        <Spacer type="light" />
        <DescriptionText>
          If you no longer wish to apply a custom rule to extract services, please use the button below to remove it.
          Removing a custom rule may take up to a few minutes.
        </DescriptionText>
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
      </Fragment>
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
        goToPath(servicesList);
      }
    });
  };
}
