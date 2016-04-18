/* global require:false */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {
  getSpanDetailView
} from 'in-sdk/tracing';

const context = require.context('../../../in-forge/tracing', true, /\/[a-zA-Z0-9]+\.es6$/);

export default React.createClass({
  displayName: 'SpanForgeDetails',

  mixins: [PureRenderMixin],

  propTypes: {
    span: irpt.map.isRequired,
    trace: irpt.map.isRequired
  },

  getInitialState() {
    return {
      Component: null
    };
  },

  componentWillMount() {
    const type = this.props.span.get('name');
    const detailViewPath = getSpanDetailView(this.props.span);
    const self = this;
    require.ensure([], function onModLoad() {
      self.setState({
        Component: context('./' + type + '/' + detailViewPath + '.es6')
      });
    });
  },

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator />;
    }
    const Component = this.state.Component;
    return (
      <Component span={this.props.span}
                 trace={this.props.trace} />
    );
  }
});
