import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getMaxSeverityForOpenIssues from 'in-hoc/getMaxSeverityForOpenIssues';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Heading from 'in-components/Tooltips/Heading';
import Content from 'in-components/Tooltips/Content';
import {getLongLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';

import LayerListing from './LayerListing.es6';
import Tooltip from '../../Tooltip.es6';


const block = 'in-tooltip-node';
const rpt = React.PropTypes;

const NodeTooltip = getMaxSeverityForOpenIssues(
                    getSnapshot(
                    React.createClass({

  displayName: 'physical node tootlip',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    maxSeverityForOpenIssues: rpt.number,
    snapshotId: rpt.string.isRequired,
    layer: rpt.array.isRequired,
    snapshot: irpt.map
  },

  render() {
    const layer = this.props.layer;
    const snapshot = this.props.snapshot;
    const maxSeverity = this.props.maxSeverityForOpenIssues;

    return (
      <TooltipFrame>
        {maxSeverity ?
          <Heading>
            {maxSeverity}
          </Heading>
          :
          <Content>
            <span className={block + '__label'}>
              Host: {snapshot ? getLongLabel(snapshot, snapshot.getIn(['data', 'hostname'])) : null}
            </span>
            {layer.length > 0 ?
              <LayerListing snapshotIds={layer.map(l => l.id)}/>
              : null}
          </Content>
        }
      </TooltipFrame>
    );
  }
})));

export default class TooltipNode extends Tooltip {
  constructor(parent) {
    super({parent});
  }

  render() {
    React.render(
      <NodeTooltip snapshotId={this.parent.id}
                   layer={this.parent.getComponent('layer').layer}
      />,
      this.container
    );
  }
}
