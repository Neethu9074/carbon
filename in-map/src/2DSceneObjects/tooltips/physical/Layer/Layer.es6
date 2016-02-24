import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import getMostImportantIssue from 'in-hoc/getMostImportantIssue';
import IssueDescription from 'in-components/IssueDescription';
import TooltipFrame from 'in-components/Tooltips/Frame';
import Content from 'in-components/Tooltips/Content';
import {getLabel} from 'in-sdk/snapshot';
import getSnapshot from 'in-hoc/getSnapshot';

import Tooltip from '../../Tooltip.es6';


const rpt = React.PropTypes;

const LayerTooltipRC = getMostImportantIssue(
                       getSnapshot(
                       React.createClass({

   displayName: 'physical layer tooltip',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    mostImportantIssue: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const snapshot = this.props.snapshot;
    if (!snapshot) {
      return null;
    }

    const mostImportantIssue = this.props.mostImportantIssue;
    return (
      <TooltipFrame>
        {mostImportantIssue ?
          <IssueDescription issue={mostImportantIssue}
                            snapshotId={this.props.snapshotId}/>
          :
          <Content>
            {getLabel(snapshot)}
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
    React.render(
      <LayerTooltipRC snapshotId={this.parent.id}/>,
      this.container
    );
  }
}
