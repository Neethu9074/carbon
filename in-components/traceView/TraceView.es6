import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import * as traceViewStores from 'in-components/traceView/traceViewStores';
import TraceListView from 'in-components/traceView/views/TraceListView';
import TraceDetailView from 'in-components/traceView/views/TraceDetailView';
import {Row, Col} from 'in-components/Grid';
import connectTo from 'in-hoc/connectTo';

import './TraceView.less';

const rpt = React.PropTypes;
const block = 'in-trace-view';

export default connectTo({
    fullscreenComponent: traceViewStores.fullscreenComponent$
  }, React.createClass({
    displayName: 'TraceView',

    mixins: [PureRenderMixin],

    propTypes: {
      height: rpt.number,
      fullscreenComponent: rpt.string
    },

    render() {
      const fullscreenComponent = this.props.fullscreenComponent;
      return (
        <section className={block}>
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
