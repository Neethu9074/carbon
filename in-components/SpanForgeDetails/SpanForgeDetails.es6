/* global require:false */
import irpt from 'react-immutable-proptypes';
import { createLogger } from 'instalog';
import React from 'react';

import { getType, getSpanDetailView, getSpanGroupingDetailView } from 'in-sdk/tracing';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Jail from 'in-components/Jail/Jail';

import './SpanForgeDetails.less';

const logger = createLogger('in-components.SpanForgeDetails');
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

  componentWillMount() {
    this.updateForge(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateForge(nextProps);
  }

  updateForge = props => {
    const type = getType(props.span);
    const detailViewPath = props.showGroupingDetails
      ? getSpanGroupingDetailView(props.span)
      : getSpanDetailView(props.span);

    if (detailViewPath) {
      const self = this;
      require(['./forgeDetailProvider.es6'], loadSpanDetailComponent => {
        self.setState({
          componentType: type,
          Component: loadSpanDetailComponent.default(type, detailViewPath)
        });
      });
    } else if (props.showGroupingDetails) {
      this.setState({
        componentType: type,
        Component: EmptyContent
      });
      logger.error('There are no group details defined for span type: ', getType(props.span));
    }
  };

  render() {
    if (!this.state.Component) {
      return <LoadingIndicator type="dark" />;
    } else if (this.state.componentType !== getType(this.props.span)) {
      return <LoadingIndicator type="dark" />;
    }

    return <Jail component={this.state.Component} props={this.props} className={block} />;
  }
}

function EmptyContent() {
  return <div />;
}
