import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TraceListHeader from 'in-components/traceView/components/TraceListHeader';
import ViewHeader from 'in-components/TwoColumnView/components/ViewHeader';
import {enable, disable} from 'in-components/traceView/stores/traceList';
import TraceTable from 'in-components/traceView/components/TraceTable';
import TwoColumnView from 'in-components/TwoColumnView/TwoColumnView';
import TraceTree from 'in-components/traceView/components/TraceTree';

const rpt = React.PropTypes;

export default React.createClass({
  displayName: 'TraceView',

  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.any
  },

  componentWillMount() {
    enable();
  },

  componentWillUnmount() {
    disable();
  },

  render() {
    return (
      <div>
        <TwoColumnView leftContent={getLeftContent()}
                       rightContent={getRightContent()} />
        {this.props.children}
      </div>
    );
  }
});

function getLeftContent() {
  return [
    <TraceListHeader key='TraceListHeader' />,
    <TraceTableHeader key='TraceTableHeader' />,
    <TraceTable key='TraceTable' />
  ];
}

function getRightContent() {
  return [
    <ViewHeader key='ViewHeader' />,
    <TraceTree key='TraceTree' />
  ];
}
