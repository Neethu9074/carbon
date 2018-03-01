import React from 'react';

import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import NewApplicationWaiter from 'in-applications/NewApplication/NewApplicationWaiter';
import { addApplicationConfig } from 'in-api/applicationConfigs';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

export default connectTo(
  {
    timeframe: timeframe$
  },
  class NewApplication extends React.Component {
    state = {
      loading: false,
      error: null,
      app: null
    };

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
            label: result.label
          }
        });
      });

      result$.errors().once(error => {
        const message = `Failed to save: ${error.message}`;
        this.setState({
          loading: false,
          error: true,
          message
        });
      });
    };
  }
);
