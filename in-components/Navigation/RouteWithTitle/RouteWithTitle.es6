import React from 'react';

import { setWindowTitleFromRoute } from 'in-services/title';
import { Route } from 'react-router-dom';
import config from 'in-services/config';

export default class RouteWithTitle extends React.Component {
  render() {
    return <Route {...this.props} />;
  }

  componentDidMount() {
    this.setWindowTitle();
  }

  componentDidUpdate() {
    this.setWindowTitle();
  }

  setWindowTitle() {
    if (this.props && this.props.windowTitle) {
      const title = `${this.props.windowTitle} – Instana (${config.tenantUnit}-${config.tenant})`;

      setWindowTitleFromRoute(title);
    } else {
      setWindowTitleFromRoute('Welcome');
    }
  }
}
