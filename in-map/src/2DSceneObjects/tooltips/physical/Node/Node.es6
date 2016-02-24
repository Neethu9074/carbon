import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getMostImportantIssue from 'in-hoc/getMostImportantIssue';
import IssueDescription from 'in-components/IssueDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';
import {getLongLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';

import LayerListing from './LayerListing.es6';
import Tooltip from '../../Tooltip.es6';


const block = 'in-tooltip-node';
const rpt = React.PropTypes;

const NodeTooltip = getMostImportantIssue(
                    getSnapshot(
                    React.createClass({

  displayName: 'physical node tootlip',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    mostImportantIssue: irpt.map,
    layer: rpt.array.isRequired,
    snapshot: irpt.map
  },

  render() {
    const mostImportantIssue = this.props.mostImportantIssue;
    const snapshot = this.props.snapshot;
    const layer = this.props.layer;

    return (
      <TooltipFrame>
        {mostImportantIssue ?
          <IssueDescription issue={mostImportantIssue}
                            snapshotId={this.props.snapshotId}/>
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
