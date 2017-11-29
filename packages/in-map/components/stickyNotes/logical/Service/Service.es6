import rpt from 'prop-types';
import React from 'react';

import ServiceInstanceList from 'in-map/components/stickyNotes/logical/Service/components/ServiceInstanceList';
import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import Heading from 'in-map/components/stickyNotes/logical/Service/components/Heading';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import { showKpi$ } from 'in-map/stores/logical/servicesStore';
import { emptyArray } from 'in-services/fixedObjects';

import connectTo from 'in-hoc/connectTo';

import 'in-map/components/stickyNotes/logical/Service/Service.less';

const block = 'in-sticky-note-service';

export default createStickyNote(
  connectTo(
    props => {
      return {
        serviceInstances: props.eventEmitter.on('serviceInstancesChanged'),
        showKpi: showKpi$.distinct()
      };
    },
    class extends React.PureComponent {
      static displayName = 'process cluster stickynote';

      static propTypes = {
        serviceInstances: rpt.array,
        id: rpt.string.isRequired,
        wrapper: rpt.object,
        showKpi: rpt.bool
      };

      state = {
        expanded: false,
        kpisAreExpanded: false
      };

      render() {
        const isExpanded = this.state.expanded;
        this.props.wrapper.style.zIndex = isExpanded || this.state.kpisAreExpanded ? 1 : 0;

        const serviceInstances = this.props.serviceInstances || emptyArray;
        const childrenAreAvailable = serviceInstances && serviceInstances.length > 0;

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
              {serviceInstances}
            </Heading>

            {isExpanded && childrenAreAvailable ? <ServiceInstanceList serviceInstances={serviceInstances} /> : null}
          </div>
        );
      }

      renderKpis = onExpand => {
        return this.props.showKpi ? <KPIList snapshotId={this.props.id} onExpand={onExpand} /> : null;
      };
    }
  )
);
