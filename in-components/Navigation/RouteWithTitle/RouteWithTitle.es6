import React from 'react';

import { setWindowTitleFromRoute } from 'in-services/title';
import { Route } from 'react-router-dom';
import config from 'in-services/config';

export default class RouteWithTitle extends React.Component {
  render() {
    return (
      <Route
        path={this.props.path}
        windowTitle={this.props.windowTitle}
        render={routeProps => {
          if (this.props.wrapper) {
            return (
              <this.props.wrapper>
                <this.props.component {...routeProps} {...this.props.props} />
              </this.props.wrapper>
            );
          }
          return <this.props.component {...routeProps} {...this.props.props} />;
        }}
      />
    );
  }

  componentDidMount() {
    this.setWindowTitle();
  }

  componentDidUpdate() {
    this.setWindowTitle();
  }

  setWindowTitle() {
    if (this.props && this.props.windowTitle) {
      if (this.proceedToSetWindowTitle()) {
        const title = `${this.props.windowTitle} – Instana (${config.tenantUnit}-${config.tenant})`;
        setWindowTitleFromRoute(title);
      }
    } else {
      setWindowTitleFromRoute('Welcome');
    }
  }

  /**
   * as dashboard routes are rendered into the parent components (means afterwards), we need to check
   * whether we really should change the title
   *
   * @returns {boolean}
   */
  proceedToSetWindowTitle() {
    const hash = window.location.hash;
    if (hash.indexOf('dashboard') !== -1) {
      if (this.props.path.indexOf('dashboard') !== -1) {
        return true;
      }
    } else {
      if (this.props.path.indexOf('dashboard') === -1) {
        return true;
      }
    }

    return false;
  }
}
