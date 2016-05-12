import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TraceDetailView from 'in-components/traceView/views/TraceDetailView';
import * as traceViewStores from 'in-components/traceView/traceViewStores';
import {enable, disable} from 'in-components/traceView/traceViewStore';
import TraceListView from 'in-components/traceView/views/TraceListView';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import {Row, Col} from 'in-components/Grid';
import connectTo from 'in-hoc/connectTo';

import './TraceView.less';

const rpt = React.PropTypes;
const block = 'in-trace-view';

export default connectTo({
    fullscreenComponent: traceViewStores.fullscreenComponent$,
    isTimelineCollapsed: isCollapsed$
  }, React.createClass({
    displayName: 'TraceView',

    mixins: [PureRenderMixin],

    propTypes: {
      height: rpt.number,
      fullscreenComponent: rpt.string,
      isTimelineCollapsed: React.PropTypes.bool.isRequired
    },

    componentWillMount() {
      enable();
    },

    componentWillUnmount() {
      disable();
    },

    render() {
      const fullscreenComponent = this.props.fullscreenComponent;
      let classes = block;
      if (!this.props.isTimelineCollapsed) {
        classes += ` ${block}--timeline-open`;
      }

      return (
        <section className={classes}>
          <Row style={{height: '100%'}}>
            <Col cols={fullscreenComponent === 'listView' ? 12 : 6}
                 style={{
                   height: '100%',
                   display: fullscreenComponent === null || fullscreenComponent === 'listView' ? 'block' : 'none'
                 }}>
              <TraceListView />
            </Col>

            <Col cols={fullscreenComponent === 'detailView' ? 12 : 6}
                 style={{
                   height: '100%',
                   display: fullscreenComponent === null || fullscreenComponent === 'detailView' ? 'block' : 'none'
                 }}>
              <TraceDetailView />
            </Col>
          </Row>
        </section>
      );
    }
}));
