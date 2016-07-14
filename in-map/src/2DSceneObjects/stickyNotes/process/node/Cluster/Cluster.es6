import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactDOM from 'react-dom';
import React from 'react';

import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import Icon from 'in-components/Icon';

import './Cluster.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-cluster';

const ProcessCluster = React.createClass({

  displayName: 'process cluster sticky',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    numChildren: rpt.number.isRequired,
    collapse: rpt.func.isRequired,
    expand: rpt.func.isRequired
  },

  getInitialState() {
    return {
      highlighted: false,
      expanded: false
    };
  },

  render() {
    const isHighlighted = this.state.highlighted || this.state.expanded;

    let className = block + '__content';
    if (isHighlighted) {
      className += ' ' + className + '--highlighted';
    }

    return (
      <div className={className}
           onMouseEnter={() => this.setState({highlighted: true})}
           onMouseLeave={() => this.setState({highlighted: false})}
           onClick={this.onClick}>
        {this.props.numChildren}
        <Icon type={this.state.expanded ? 'open' : 'close'}
              className={block + '__icon'}/>
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
});


export default class StickyNoteProcessCluster extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});
  }

  render() {
    const parent = this.parent;

    ReactDOM.render(
      <ProcessCluster numChildren={this.numChildren}
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
