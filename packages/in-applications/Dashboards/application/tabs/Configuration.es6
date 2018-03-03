import React from 'react';

import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import { getApplicationConfig, updateApplicationConfig } from 'in-api/applicationConfigs';
import Form from 'in-applications/NewApplication/Form';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    app: getApplicationConfig(props.applicationId)
  }),
  class Configuration extends React.Component {
    state = {
      loading: false,
      error: null,
      app: null
    };

    onSubmit = appConfig => {
      const result$ = updateApplicationConfig(appConfig);
      this.setState({
        loading: true,
        error: false,
        message: 'Saving…'
      });

      result$.once(() => {
        this.setState({
          loading: false,
          error: false
        });
      });

      result$.errors().once(() => {
        this.setState({
          loading: false,
          error: true
        });
      });
    };

    render() {
      if (this.props.app == null) {
        return <DefaultLoadingDashboard />;
      }

      return (
        <Form
          onSubmit={this.onSubmit}
          application={this.props.app}
          loading={this.state.loading}
          loadingStateName="Saving…"
          error={this.state.error}
        />
      );
    }
  }
);
