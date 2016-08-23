import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ServiceInstanceList from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstanceList';
import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import {showKpi$, showSticky$} from 'in-map/stores/logical/servicesStore';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptyArray} from 'in-services/fixedObjects';
import {getSnapshot} from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import {getLabel} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/logical/Service/Service.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-service';

export default createStickyNote(
  connectTo(props => {
    return {
      children: getClusterMembers(props.props.id),
      snapshot: getSnapshot(props.props.id),
      showSticky: showSticky$.distinct(),
      showKpi: showKpi$.distinct()
    };
  },
  React.createClass({

    displayName: 'process cluster sticky',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      id: rpt.string.isRequired,
      showSticky: rpt.bool,
      wrapper: rpt.object,
      children: irpt.set,
      snapshot: irpt.map,
      showKpi: rpt.bool
    },

    getInitialState() {
      return {
        highlighted: false,
        expanded: false
      };
    },

    render() {
      if (!this.props.showSticky) {
        return null;
      }

      const isExpanded = this.state.expanded;
      this.props.wrapper.style.zIndex = isExpanded ? 1 : 0;

      const children = this.props.children || emptyArray;
      const childrenAreAvailable = children && children.size > 0;

      let headerClassName = block + '__header';
      if (this.state.highlighted || isExpanded) {
        headerClassName += ' ' + headerClassName + '--highlighted';
      }

      let contentClassName = block;
      if (isExpanded) {
        contentClassName += ' ' + contentClassName + '--expanded';
      }

      return (
        <div className={contentClassName}>
          {this.props.showKpi ?
            <KPIList snapshotId={this.props.id}
                     isHighlighted={() => {}}/>
            : null
          }

          {childrenAreAvailable ?
            <div className={headerClassName}
                 onMouseEnter={() => this.setState({highlighted: true})}
                 onMouseLeave={() => this.setState({highlighted: false})}
                 onClick={this.onClick}>
              {getLabel(this.props.snapshot) + ' (' + children.size + ')'}
              <Icon expanded={isExpanded} />
            </div>
            :
            <div className={headerClassName}>
              {getLabel(this.props.snapshot)}
            </div>
          }

          {(isExpanded && childrenAreAvailable) ?
            <ServiceInstanceList ids={children} />
          : null}
        </div>
      );
    },

    onClick() {
      // !this.state.expanded ? this.props.client.expand() : this.props.client.collapse();
      this.setState({expanded: !this.state.expanded});
    }
  })
));

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
