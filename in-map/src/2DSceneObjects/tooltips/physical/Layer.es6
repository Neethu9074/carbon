import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';
import ReactDOM from 'react-dom';

import getMostImportantEvent from 'in-hoc/getMostImportantEvent';
import EventDescription from 'in-components/EventDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';
import {getSingular} from 'in-sdk/pluginName';
import getSnapshot from 'in-hoc/getSnapshot';
import {getLabel} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip.es6';


const rpt = React.PropTypes;

const LayerTooltipRC = getMostImportantEvent(
                       getSnapshot(
                       React.createClass({

   displayName: 'physical layer tooltip',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    mostImportantEvent: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const mostImportantEvent = this.props.mostImportantEvent;
    return (
      <TooltipFrame>
        {mostImportantEvent ?
          <EventDescription event={mostImportantEvent}
                            snapshotId={this.props.snapshotId}/>
          :
          <Content>
            {getSingular(snapshot.get('plugin'))}: {getLabel(snapshot)}
          </Content>
        }
      </TooltipFrame>
    );
  }
})));


export default class TooltipLayer extends Tooltip {
  constructor(parent) {
    super({parent});
  }

  render() {
    ReactDOM.render(
      <LayerTooltipRC snapshotId={this.parent.id}/>,
      this.container
    );
  }
}
