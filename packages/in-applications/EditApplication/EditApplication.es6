import React from 'react';

import EditApplicationPresenter from 'in-applications/EditApplication/EditApplicationPresenter';
import { updateApplicationConfig } from 'in-api/applicationConfigs';
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
      error: null
    };

    render() {
      return (
        <section>
          <Title title="Edit application" />

          {this.state.app == null ? (
            <EditApplicationPresenter
              onSubmit={this.onSubmit}
              loading={this.state.loading}
              loadingStateName="Saving…"
              error={this.state.error}
            />
          ) : null}
        </section>
      );
    }

    onSubmit = appConfig => {
      const result$ = updateApplicationConfig(appConfig);
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
