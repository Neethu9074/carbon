import React from 'react';

import { Route } from 'react-router-dom';

import { setWindowTitleFromRoute } from 'in-services/title';

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
      setWindowTitleFromRoute(this.props.windowTitle);
    } else {
      setWindowTitleFromRoute('Welcome');
    }
  }
}
