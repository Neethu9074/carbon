/* global require:false */
import irpt from 'react-immutable-proptypes';
import React from 'react';

import LoadingIndicator from 'in-components/LoadingIndicator';
import { getType, getSpanDetailView } from 'in-sdk/tracing';
import Jail from 'in-components/Jail/Jail';

import './SpanForgeDetails.less';

const block = 'in-span-forge-details';

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
    const detailViewPath = getSpanDetailView(props.span);
    if (detailViewPath) {
      require(['./forgeDetailProvider.js'], loadSpanDetailComponent => {
        if (this.mounted) {
          this.setState({
            componentType: type,
            Component: loadSpanDetailComponent.default(type, detailViewPath)
          });
        }
      });
    }
  };

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator type="dark" />;
    } else if (this.state.componentType !== getType(this.props.span)) {
      return <LoadingIndicator type="dark" />;
    }

    return <Jail key={this.props.span} component={this.state.Component} props={this.props} className={block} />;
  }
}
