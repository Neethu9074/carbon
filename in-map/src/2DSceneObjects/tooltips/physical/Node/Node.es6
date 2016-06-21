import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import getMostImportantEvent from 'in-hoc/getMostImportantEvent';
import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';

import LayerListing from 'in-map/src/2DSceneObjects/tooltips/physical/Node/LayerListing.es6';
import Tooltip from 'in-map/src/2DSceneObjects/tooltips/Tooltip.es6';


const rpt = React.PropTypes;

const NodeTooltip = getMostImportantEvent(
                    getSnapshot(
                    React.createClass({

  displayName: 'physical node tootlip',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    mostImportantEvent: irpt.map,
    layer: rpt.array.isRequired,
    snapshot: irpt.map
  },

  render() {
    const mostImportantEvent = this.props.mostImportantEvent;
    const snapshot = this.props.snapshot;
    const layer = this.props.layer;

    return (
      <TooltipFrame>
        {mostImportantEvent ?
          <EventDescription event={mostImportantEvent}
                            showFullTextIfToLong={false}
                            snapshotId={this.props.snapshotId}/>
          :
          <Content>
            {snapshot ? getLabel(snapshot, snapshot.getIn(['data', 'hostname'])) : null}
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
    ReactDOM.render(
      <NodeTooltip snapshotId={this.parent.id}
                   layer={this.parent.getComponent('layer').layer}
      />,
      this.container
    );
  }
}
