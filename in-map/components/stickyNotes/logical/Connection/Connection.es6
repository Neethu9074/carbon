import React from 'react';

import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import { showSticky$ } from 'in-map/stores/logical/connectionsStore';
import connectTo from 'in-hoc/connectTo';

const rpt = React.PropTypes;

export default createStickyNote(
  connectTo(
    {
      showSticky: showSticky$.distinct()
    },
    React.createClass({
      displayName: 'logical connection sticky',

      propTypes: {
        id: rpt.string.isRequired,
        showSticky: rpt.bool,
        wrapper: rpt.object
      },

      getInitialState() {
        return {
          kpisAreExpanded: false
        };
      },

      render() {
        const snapshotId = this.props.id;
        if (!snapshotId || !this.props.showSticky) {
          return null;
        }

        this.props.wrapper.style.zIndex = this.state.kpisAreExpanded ? 1 : 0;

        return <KPIList snapshotId={snapshotId} onExpand={kpisAreExpanded => this.setState({ kpisAreExpanded })} />;
      }
    })
  )
);
