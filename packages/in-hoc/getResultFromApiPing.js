/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Component } from 'react';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';
import http from 'in-services/http';

export default ({ url, checkResult }) => BaseComponent => {
  return class ResultFromApiPingClass extends Component {
    static displayName = getDisplayName(BaseComponent, 'getResultFromApiPing');

    constructor(props) {
      super(props);

      this.state = {
        apiCallSatisfied: false
      };
    }

    componentDidMount() {
      this.fetchEnvironmentStatus();
    }

    componentWillUnmount() {
      this.disposeTimeout();
    }

    disposeTimeout = () => {
      if (this.fetchLaterHandle) {
        clearTimeout(this.fetchLaterHandle);
      }
    };

    tryFetchEnvironmentStatus = () => {
      this.disposeTimeout();
      this.fetchLaterHandle = setTimeout(this.fetchEnvironmentStatus, 2 * 1000);
    };

    fetchEnvironmentStatus = () => {
      const result$ = http({
        method: 'GET',
        maxRetries: 3,
        url
      }).map(response => response.body);

      result$.once(result => {
        const shouldRetry = !checkResult(result);
        if (shouldRetry) {
          this.tryFetchEnvironmentStatus();
        } else {
          this.setState({ apiCallSatisfied: true });
        }
      });

      // ignore HTTP errors silently and try again later
      result$.errors().once(this.tryFetchEnvironmentStatus);
    };

    render() {
      return <BaseComponent {...this.props} {...this.state} />;
    }
  };
};
