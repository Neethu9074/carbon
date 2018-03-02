import React from 'react';

import { addApplicationConfig, updateApplicationConfig, getApplicationConfig } from 'in-api/applicationConfigs';
import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import NewApplicationWaiter from 'in-applications/NewApplication/NewApplicationWaiter';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { applicationId } from 'in-applications/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { timeframe$ } from 'in-stores/timeline';
import { just } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default connectTo(
  props => {
    const observables = {
      timeframe: timeframe$
    };

    const appId = getMatrixParameter(props.location, applicationDashboard, applicationId);
    if (appId == null) {
      observables.appToEdit = just(null);
    } else {
      observables.appToEdit = getApplicationConfig(appId);
    }

    return observables;
  },
  class NewApplication extends React.Component {
    state = {
      loading: false,
      error: null,
      app: null
    };

    getAppToEdit() {
      if (this.props.appToEdit == null) {
        return {};
      }

      return this.props.appToEdit;
    }

    render() {
      return (
        <section>
          <Title title="New application" />

          {this.state.app == null ? (
            <NewApplicationPresenter
              onSubmit={this.onSubmit}
              loading={this.state.loading}
              loadingStateName="Saving…"
              error={this.state.error}
              application={this.getAppToEdit()}
            />
          ) : null}

          {this.state.app != null ? (
            <NewApplicationWaiter
              applicationId={this.state.app.id}
              applicationToEdit={this.props.appToEdit}
              label={this.state.app.label}
              timeframe={this.props.timeframe}
            />
          ) : null}
        </section>
      );
    }

    onSubmit = appConfig => {
      const result$ =
        this.props.appToEdit == null ? addApplicationConfig(appConfig) : updateApplicationConfig(appConfig);
      this.setState({
        loading: true,
        error: false,
        message: 'Saving…'
      });

      result$.once(result => {
        this.setState({
          app: {
            id: result.id,
            label: result.label,
            loading: false,
            error: false
          }
        });
      });

      result$.errors().once(() => {
        this.setState({
          loading: false,
          error: true
        });
      });
    };
  }
);
