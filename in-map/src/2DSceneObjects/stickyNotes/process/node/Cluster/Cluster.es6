import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import {getColorPool} from 'in-services/util/ColorGenerator';
import getSnapshot from 'in-hoc/getSnapshot';
import Icon from 'in-components/Icon';

import './Cluster.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-cluster';

const ProcessCluster = getSnapshot(React.createClass({

  displayName: 'process cluster sticky',

  mixins: [
    PureRenderMixin
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
        <Icon type={this.state.expanded ? 'open' : 'close'}
              className={block + '__icon'}
              onClick={this.onClick} />
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
    const parent = this.parent;

    ReactDOM.render(
      <ProcessCluster numChildren={this.numChildren}
                      snapshotId={parent.id}
                      expand={() => parent.expand()}
                      collapse={() => parent.collapse()}/>,
      this.container
    );
  }

  setNumChildren(numChildren) {
    this.numChildren = numChildren;
    this.render();
  }
}
