/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import irpt from 'react-immutable-proptypes';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getType, getSpanDetailView, getCategory } from 'in-sdk/tracing';
import Jail from 'in-components/Jail/Jail';

export default class extends React.PureComponent {
  static displayName = 'SpanForgeDetails';

  static propTypes = {
    span: irpt.map.isRequired
  };

  state = {
    componentType: null,
    Component: null
  };

  componentDidMount() {
    this.mounted = true;
    this.updateForge(this.props);
  }

  componentDidUpdate(nextProps) {
    this.updateForge(nextProps);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateForge = props => {
    const type = getType(props.span);
    const category = getCategory(props.span);
    const detailViewPath = getSpanDetailView(props.span);
    // Note: Due to the way require(…) is transpiled arrow functions do not properly work here.
    // We therefore have to explicitly remember the value of 'this' :sadpanda:.
    const self = this;
    if (detailViewPath) {
      require(['./forgeDetailProvider.js'], loadSpanDetailComponent => {
        if (self.mounted) {
          if (category === 'bpm') {
            self.setState({
              componentType: type,
              Component: loadSpanDetailComponent.default(category, detailViewPath)
            });
          } else {
            self.setState({
              componentType: type,
              Component: loadSpanDetailComponent.default(type, detailViewPath)
            });
          }
        }
      });
    }
  };

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator />;
    } else if (this.state.componentType !== getType(this.props.span)) {
      return <LoadingIndicator />;
    }

    return <Jail key={this.props.span} component={this.state.Component} props={this.props} />;
  }
}
