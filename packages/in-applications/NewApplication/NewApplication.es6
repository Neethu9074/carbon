import React from 'react';

import NewApplicationPresenter from 'in-applications/NewApplication/NewApplicationPresenter';
import Title from 'in-components/Title';

export default class NewApplication extends React.Component {
  state = {
    loading: false,
    error: null
  };

  render() {
    return (
      <section>
        <Title title="New application" />

        <NewApplicationPresenter
          onSubmit={this.onSubmit}
          loading={this.state.loading}
          loadingStateName="Saving…"
          error={this.state.error}
        />
      </section>
    );
  }

  onSubmit = appConfig => {
    window.console.dir(appConfig);
  };
}
