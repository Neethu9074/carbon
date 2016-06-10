import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  toggleNodeMetrics,
  nodeMetricsAreActive$,
  connectionMetricsAreActive$,
  toggleConnectionMetrics
} from 'in-map/src/3DSceneObjects/process/processViewStores';
import {isInternalEnvironment} from 'in-services/config';
import {view, types} from 'in-stores/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-components/ProcessMetricSwitch/ProcessMetricSwitch.less';


const block = 'in-process-metric-switch';
const rpt = React.PropTypes;

export default connectTo({
  nodeMetricsAreActive: nodeMetricsAreActive$,
  connectionMetricsAreActive: connectionMetricsAreActive$,
  view
  }, React.createClass({

    displayName: 'ProcessMetricSwitch',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      connectionMetricsAreActive: rpt.bool,
      nodeMetricsAreActive: rpt.bool,
      view: rpt.string
    },

    render() {
      if (!isInternalEnvironment() || this.props.view !== types.process) {
        return null;
      }

      return (
        <div className={block}>
          <Button onClick={toggleNodeMetrics}>
            {this.props.nodeMetricsAreActive ? 'node metrics off' : 'node metrics on'}
          </Button>
          <br />
          <Button onClick={toggleConnectionMetrics}>
            {this.props.connectionMetricsAreActive ? 'connections metrics off' : 'connections metrics on'}
          </Button>
        </div>
      );
    }
  })
);
