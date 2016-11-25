/* global require:false */

import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import {getType, getSpanDetailView} from 'in-sdk/tracing';
import Jail from 'in-components/Jail/Jail';

const block = 'in-span-forge-details';

export default React.createClass({
  displayName: 'SpanForgeDetails',

  mixins: [PureRenderMixin],

  propTypes: {
    span: irpt.map.isRequired
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
    const type = getType(props.span);
    const detailViewPath = getSpanDetailView(props.span);

    if (detailViewPath) {
      const self = this;
      require(['./forgeDetailProvider.es6'], (loadSpanDetailComponent) => {
        self.setState({
          componentType: type,
          Component: loadSpanDetailComponent.default(type, detailViewPath)
        });
      });
    }
  },

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator type='dark' />;
    } else if (this.state.componentType !== getType(this.props.span)) {
      return <LoadingIndicator type='dark' />;
    }

    return (
      <Jail component={this.state.Component}
            props={this.props}
            className={block} />
    );
  }
});
