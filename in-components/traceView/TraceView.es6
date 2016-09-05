import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TraceTableHeader from 'in-components/traceView/components/TraceTableHeader';
import TraceViewHeader from 'in-components/traceView/components/TraceViewHeader';
import TraceListHeader from 'in-components/traceView/components/TraceListHeader';
import {enable, disable} from 'in-components/traceView/stores/traceList';
import TraceTable from 'in-components/traceView/components/TraceTable';
import TraceTree from 'in-components/traceView/components/TraceTree';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TraceView.less';


const rpt = React.PropTypes;
const block = 'in-trace-view';

export default connectTo({
    timelineHeight: timelineHeight$
  }, React.createClass({

    displayName: 'TraceView',

    mixins: [PureRenderMixin],

    propTypes: {
      timelineHeight: rpt.number.isRequired,
      height: rpt.number
    },

    componentWillMount() {
      enable();
    },

    componentWillUnmount() {
      disable();
    },

    render() {
      return (
        <section className={block}
                 style={{
                   bottom: toPx(this.props.timelineHeight)
                 }}>
          <div className={`${block}__trace-list`}>
            <TraceListHeader />
            <TraceTableHeader />
            <TraceTable />
          </div>
          <div className={`${block}__trace-details`}>
            <TraceViewHeader />
            <TraceTree />
          </div>
        </section>
      );
    }
}));
