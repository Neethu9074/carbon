import PureRenderMixin from 'react-addons-pure-render-mixin';
import { combineLatest } from 'reactive-observables';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import ServiceInstanceList from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstanceList';
import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import Heading from 'in-map/components/stickyNotes/logical/Service/components/Heading';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { showKpi$ } from 'in-map/stores/logical/servicesStore';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { emptyArray } from 'in-services/fixedObjects';

import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/logical/Service/Service.less';

const rpt = React.PropTypes;
const block = 'in-sticky-note-service';

export default createStickyNote(
  connectTo(
    props => {
      return {
        children: combineLatest([getClusterMembers(props.id), searchMatches$]).map(([children, searchMatches]) =>
          children.filter(child => !searchMatches || searchMatches.contains(child))),
        showKpi: showKpi$.distinct()
      };
    },
    React.createClass({
      displayName: 'process cluster stickynote',

      mixins: [PureRenderMixin],

      propTypes: {
        id: rpt.string.isRequired,
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
        const isExpanded = this.state.expanded;
        this.props.wrapper.style.zIndex = isExpanded || this.state.kpisAreExpanded ? 1 : 0;

        const children = this.props.children || emptyArray;
        const childrenAreAvailable = children && children.size > 0;

        let contentClassName = block;
        if (isExpanded) {
          contentClassName += ' ' + contentClassName + '--expanded';
        }

        return (
          <div className={contentClassName}>
            {this.renderKpis(kpisAreExpanded => this.setState({ kpisAreExpanded }))}

            <Heading
              expanded={isExpanded}
              snapshotId={this.props.id}
              onClick={() => this.setState({ expanded: !this.state.expanded })}
            >
              {children}
            </Heading>

            {isExpanded && childrenAreAvailable ? <ServiceInstanceList ids={children} /> : null}
          </div>
        );
      },

      renderKpis(onExpand) {
        return this.props.showKpi ? <KPIList snapshotId={this.props.id} onExpand={onExpand} /> : null;
      }
    })
  )
);
