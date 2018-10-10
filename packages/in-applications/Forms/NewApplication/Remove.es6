import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { deleteApplicationConfig } from 'in-api/applicationConfigs';
import { applicationsList } from 'in-applications/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import { createTracker } from 'in-services/tracking/mixpanel';
import Spacer from 'in-applications/Forms/components/Spacer';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-components/Button';

import locals from './Remove.mless';

const trackDeleteApplication = createTracker('application.delete');

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
      <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
        <div className={locals.header}>
          <h1 className={locals.heading}>Remove Application Perspective</h1>
        </div>
        <Spacer type="dark" />
        <DescriptionText>
          If you no longer wish to monitor the application perspective <strong>{application.label}</strong>, please use
          the button below to remove it. Removing an application perspective may take up to a few minutes.
        </DescriptionText>
        <input type="checkbox" checked={this.state.checkboxChecked} onChange={this.onTickChange} disabled={loading} /> I
        understand that this action cannot be undone.
        {removeError && <SaveError>{removeError}</SaveError>}
        <div className={locals.footer}>
          <Button
            kind="danger"
            disabled={loading || !this.state.checkboxChecked}
            onClick={this.remove}
            className={locals.removeButton}
          >
            Remove Application Perspective
          </Button>
        </div>
      </MaxWidthFullscreenContainer>
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

    this.subscription = combineDataAndError(
      deleteApplicationConfig(this.props.application.id).tap(() =>
        trackDeleteApplication({ id: this.props.application.id, label: this.props.application.label })
      )
    ).once(({ error }) => {
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
