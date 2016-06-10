import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
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
    expand: rpt.func.isRequired
  },

  getInitialState() {
    return {
      expanded: false
    };
  },

  render() {
    return (
      <Icon type={this.state.expanded ? 'timeline_close' : 'timeline_open'}
            className={block + '__content'}
            onClick={this.onClick} />
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
      <ProcessCluster snapshotId={parent.id}
                      expand={() => parent.expand()}
                      collapse={() => parent.collapse()}/>,
      this.container
    );
  }
}
