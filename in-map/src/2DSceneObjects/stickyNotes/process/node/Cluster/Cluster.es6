import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import PhysicalEntitiesList from
  'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/PhysicalEntitiesList';
import ExpandableHeader from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/ExpandableHeader';
import KPIList from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/KPIList';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import {getSnapshot} from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Cluster.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-cluster';

const ProcessCluster = connectTo(props => {
  return {
    isFullyVisible: props.client.eventEmitter.on('stickyFullyVisibilityChanged').distinct(),
    isVisible: props.client.eventEmitter.on('isVisibleChanged_screenPosition').distinct(),
    isToFarAway: props.client.eventEmitter.on('stickyIsToFarAwayChanged').distinct(),
    snapshot: getSnapshot(props.client.id)
  };
}, React.createClass({

    displayName: 'process cluster sticky',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      isHighlighted: rpt.func.isRequired,
      client: rpt.any.isRequired,
      isFullyVisible: rpt.bool,
      isToFarAway: rpt.bool,
      isVisible: rpt.bool,
      children: irpt.list,
      snapshot: irpt.map
    },

    getInitialState() {
      return {
        kpisAreHighlighted: false,
        highlighted: false,
        expanded: false
      };
    },

    render() {
      if (!this.props.isVisible || this.props.isToFarAway) {
        return null;
      }

      this.props.isHighlighted(this.state.kpisAreHighlighted || this.state.expanded);

      const children = this.props.children;
      const numChildren = children ? children.size : 0;
      const isHighlighted = this.state.highlighted;
      const isExpanded = this.state.expanded;
      const id = this.props.client.id;

      let contentClassName = block + '__content';
      if (isExpanded) {
        contentClassName += ' ' + contentClassName + '--expanded';
      }

      return (
        <div className={contentClassName}>
          {this.props.isFullyVisible
            ? <KPIList snapshotId={id}
                     isHighlighted={kpisAreHighlighted => this.setState({kpisAreHighlighted})} />
            : null}

          <ExpandableHeader expanded={isExpanded}
                            highlighted={isExpanded || isHighlighted}
                            snapshot={this.props.snapshot}
                            numItems={numChildren}
                            onClick={() => this.setState({expanded: !isExpanded})}
                            isHighlighted={highlighted => this.setState({highlighted})} />

          {(isExpanded && numChildren > 0)
            ? <PhysicalEntitiesList ids={children}
                                  parentId={id} />
            : null}
        </div>
      );
    }
  })
);


export default class StickyNoteProcessCluster extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});
  }

  render() {
    const parent = this.parent;

    ReactDOM.render(
      <ProcessCluster children={this.children}
                      isHighlighted={this.isHighlighted.bind(this)}
                      client={parent} />,
      this.container
    );
  }

  isHighlighted(isHighlighted) {
    if (isHighlighted) {
      this.style.zIndex = 1;
    } else {
      this.style.zIndex = 0;
    }
  }

  setChildren(children) {
    this.children = children;
    this.render();
  }
}
