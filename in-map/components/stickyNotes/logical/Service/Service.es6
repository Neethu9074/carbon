import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ServiceInstanceList from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstanceList';
import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import Heading from 'in-map/components/stickyNotes/logical/Service/components/Heading';
import {showKpi$, showSticky$} from 'in-map/stores/logical/servicesStore';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import {getClusterMembers} from 'in-stores/clusterMembers';
import {emptyArray} from 'in-services/fixedObjects';

import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/logical/Service/Service.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-service';

export default createStickyNote(
  connectTo(props => {
    return {
      children: getClusterMembers(props.id).map(ids => ids.filter(id => props.includedIds.serviceInstanceIds[id] ? true: false)),
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
      showKpi: rpt.bool
    },

    getInitialState() {
      return {
        expanded: false,
        kpisAreExpanded: false
      };
    },

    render() {
      if (!this.props.showSticky) {
        return null;
      }

      const isExpanded = this.state.expanded;
      this.props.wrapper.style.zIndex = (isExpanded || this.state.kpisAreExpanded) ? 1 : 0;

      const children = this.props.children || emptyArray;
      const childrenAreAvailable = children && children.size > 0;

      let contentClassName = block;
      if (isExpanded) {
        contentClassName += ' ' + contentClassName + '--expanded';
      }

      return (
        <div className={contentClassName}>
          {this.renderKpis(kpisAreExpanded => this.setState({kpisAreExpanded}))}

          <Heading expanded={isExpanded}
                   snapshotId={this.props.id}
                   onClick={() => this.setState({expanded: !this.state.expanded})}>
            {children}
          </Heading>

          {(isExpanded && childrenAreAvailable) ?
            <ServiceInstanceList ids={children} />
          : null}
        </div>
      );
    },

    renderKpis(onExpand) {
      return this.props.showKpi
        ? <KPIList snapshotId={this.props.id}
                   onExpand={onExpand} />
        : null;
    }
  })
));
