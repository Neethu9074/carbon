import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import ReactDOM from 'react-dom';
import React from 'react';

import PhysicalEntitiesList from
  'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/PhysicalEntitiesList';
import KPIList from 'in-map/src/2DSceneObjects/stickyNotes/process/node/Cluster/components/KPIList';
import StickyNote from 'in-map/src/2DSceneObjects/stickyNotes/StickyNote';
import {getSnapshot} from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Cluster.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-process-cluster';

const ProcessCluster = connectTo(props => {
  return {
    isFullyVisible: props.client.eventEmitter.on('sicktyFullyVisibilityChanged').distinct(),
    isVisible: props.client.eventEmitter.on('isVisibleChanged_screenPosition').distinct(),
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
      const isVisible = this.props.isVisible;
      if (!isVisible) {
        return null;
      }

      this.props.isHighlighted(this.state.kpisAreHighlighted || this.state.expanded);

      const children = this.props.children;
      const childrenAreAvailable = children && children.size > 0;

      let headerClassName = block + '__header';
      if (this.state.highlighted || this.state.expanded) {
        headerClassName += ' ' + headerClassName + '--highlighted';
      }

      let contentClassName = block + '__content';
      if (this.state.expanded) {
        contentClassName += ' ' + contentClassName + '--expanded';
      }

      return (
        <div className={contentClassName}>
          {this.props.isFullyVisible ?
            <KPIList snapshotId={this.props.client.id}
                     isHighlighted={kpisAreHighlighted => this.setState({kpisAreHighlighted})} />
            : null
          }

          {childrenAreAvailable ?
            <div className={headerClassName}
                 onMouseEnter={() => this.setState({highlighted: true})}
                 onMouseLeave={() => this.setState({highlighted: false})}
                 onClick={this.onClick}>
              {getLabel(this.props.snapshot) + ' (' + children.size + ')'}
              <Icon expanded={this.state.expanded} />
            </div>
            :
            <div className={headerClassName}>
              {getLabel(this.props.snapshot)}
            </div>
          }

          {(this.state.expanded && childrenAreAvailable) ?
            <PhysicalEntitiesList ids={children}
                                  parentId={this.props.client.id} />
          : null}
        </div>
      );
    },

    onClick() {
      // !this.state.expanded ? this.props.client.expand() : this.props.client.collapse();
      this.setState({expanded: !this.state.expanded});
    }
  })
);

function Icon({expanded}) {
  let className = block + '__icon-wrapper';
  if (expanded) {
    className += ' ' + className + '--expanded';
  }

  return (
    <div className={className}>
      <SvgIcon type={expanded ? 'triangle_up' : 'triangle_down'}
               width={4}
               height={4}
               color={expanded ? '#000' : '#2d4048'}
               className={block + '__icon'}/>
    </div>
  );
}


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
