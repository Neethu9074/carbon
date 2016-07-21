import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import PhysicalEntitiesList from
  'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/PhysicalEntitiesList';
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
    parentId: rpt.string.isRequired,
    collapse: rpt.func.isRequired,
    expand: rpt.func.isRequired,
    childIds: irpt.list
  },

  getInitialState() {
    return {
      highlighted: false,
      expanded: false
    };
  },

  render() {
    const childIds = this.props.childIds;
    if (!childIds || childIds.size === 0) {
      return null;
    }

    let className = block + '__content';
    if (this.state.highlighted || this.state.expanded) {
      className += ' ' + className + '--highlighted';
    }

    return (
      <div className={block}>
        <div className={className}
             onMouseEnter={() => this.setState({highlighted: true})}
             onMouseLeave={() => this.setState({highlighted: false})}
             onClick={this.onClick}>
          {childIds.size}
          <Icon type={this.state.expanded ? 'close_up' : 'close'}
                className={block + '__icon'}/>
        </div>
        {this.state.expanded ?
          <PhysicalEntitiesList
            childIds={childIds}
            parentId={this.props.parentId} />
          : null}
      </div>
    );
  },

  onClick() {
    // !this.state.expanded ? this.props.expand() : this.props.collapse();

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
      <ProcessCluster childIds={this.childIds}
                      expand={() => parent.expand()}
                      parentId={parent.id}
                      collapse={() => parent.collapse()}/>,
      this.container
    );
  }

  setChildren(childIds) {
    this.childIds = childIds;
    this.render();
  }
}
