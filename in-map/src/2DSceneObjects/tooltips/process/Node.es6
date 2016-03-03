import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';
import ReactDOM from 'react-dom';

import TooltipFrame from 'in-components/Tooltips/Frame';
import {getLongLabel, getLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';

import Tooltip from '../Tooltip.es6';


const rpt = React.PropTypes;

const NodeTooltip = getSnapshot(
                    React.createClass({

  displayName: 'process node tootlip',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;

    return (
      <TooltipFrame>
        {snapshot ? getLongLabel(snapshot, getLabel(snapshot, 'process')) : null}
      </TooltipFrame>
    );
  }
}));

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super({parent});
  }

  render() {
    ReactDOM.render(
      <NodeTooltip snapshotId={this.parent.id}/>,
      this.container
    );
  }
}
