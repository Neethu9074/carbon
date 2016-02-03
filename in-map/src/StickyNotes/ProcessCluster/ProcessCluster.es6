import irpt from 'react-immutable-proptypes';
import React from 'react/addons';

import {getColorPool} from 'in-services/util/ColorGenerator';
import getSnapshot from 'in-hoc/getSnapshot';
import Icon from 'in-components/Icon';

import StickyNote from '../StickyNote';

import './ProcessCluster.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-cluster';

const ProcessCluster = getSnapshot(React.createClass({

  displayName: 'ProcessCluster',

  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    numChildren: rpt.number.isRequired,
    snapshotId: rpt.string.isRequired,
    collapse: rpt.func.isRequired,
    expand: rpt.func.isRequired,
    snapshot: irpt.map
  },

  getInitialState() {
    return {
      expanded: false
    };
  },

  render() {
    const snapshot = this.props.snapshot;
    const color = snapshot ? getColorPool('processes').getColorHex(snapshot.get('plugin')) : '#999';


    return (
      <div className={block + '__content'}
           style={{backgroundColor: color}}>
        {this.props.numChildren}
        <div className={block + '__button'}
             onClick={this.onClick}>
          <Icon className={block + '__icon'}
                type={this.state.expanded ? 'close' : 'open'} />
        </div>
      </div>
    );
  },

  onClick() {
    if (!this.state.expanded) {
      this.props.expand();
    } else {
      this.props.collapse();
    }

    this.setState({expanded: !this.state.expanded});
  }
}));


export default class StickyNoteProcessCluster extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});
  }

  render() {
    React.render(
      <ProcessCluster snapshotId={this.parent.id}
                      numChildren={this.numChildren}
                      expand={() => this.parent.expand()}
                      collapse={() => this.parent.collapse()}/>,
      this.stickyNoteContainer
    );
  }

  setNumChildren(numChildren) {
    this.numChildren = numChildren;
    this.render();
  }
}
