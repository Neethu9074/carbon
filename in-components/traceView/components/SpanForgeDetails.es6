/* global require:false */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {getSpanDetailView} from 'in-sdk/tracing';
import Jail from 'in-components/Jail/Jail';

import './SpanForgeDetails.less';

const context = require.context('../../../in-forge/tracing', true, /\/[a-zA-Z0-9]+\.es6$/);

const block = 'in-span-forge-details';

export default React.createClass({
  displayName: 'SpanForgeDetails',

  mixins: [PureRenderMixin],

  propTypes: {
    span: irpt.map.isRequired,
    trace: irpt.map.isRequired
  },

  getInitialState() {
    return {
      componentType: null,
      Component: null
    };
  },

  componentWillMount() {
    this.updateForge(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.updateForge(nextProps);
  },

  updateForge(props) {
    const type = props.span.get('name');
    const detailViewPath = getSpanDetailView(props.span);

    if (detailViewPath) {
      const self = this;
      require.ensure([], function onModLoad() {
        self.setState({
          componentType: type,
          Component: context('./' + type + '/' + detailViewPath + '.es6')
        });
      });
    }
  },

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator />;
    } else if (this.state.componentType !== this.props.span.get('name')) {
      return <LoadingIndicator />;
    }

    return (
      <Jail component={this.state.Component}
            props={this.props}
            className={block} />
    );
  }
});
