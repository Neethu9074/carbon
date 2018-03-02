import React from 'react';

import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import NewApplicationWaiter from 'in-applications/NewApplication/NewApplicationWaiter';
import getApplication from 'in-subscription/application/getApplication';
import { applicationDashboard } from 'in-applications/navigation/paths';
import { applicationId } from 'in-applications/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { addApplicationConfig } from 'in-api/applicationConfigs';
import { timeframe$ } from 'in-stores/timeline';
import { just } from 'reactive-observables';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default connectTo(
  props => ({
    timeframe: timeframe$,
    appToEdit: timeframe$.flatMap(timeframe => {
      const appId = getMatrixParameter(props.location, applicationDashboard, applicationId);
      if (appId == null) {
        return just(null);
      } else {
        return getApplication({
          id: appId,
          filter: {
            application: appId,
            timeframe: timeframe
          }
        });
      }
    })
  }),
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

      if (this.props.appToEdit.errors.length > 0 || this.props.appToEdit.progress.loading) {
        return {};
      }

      return this.props.appToEdit.data;
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
              label={this.state.app.label}
              timeframe={this.props.timeframe}
            />
          ) : null}
        </section>
      );
    }

    onSubmit = appConfig => {
      const result$ = addApplicationConfig(appConfig);
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
