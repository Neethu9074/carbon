import React from 'react';

import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';

const rpt = React.PropTypes;

export default createStickyNote(
  React.createClass({
    displayName: 'logical connection sticky',

    propTypes: {
      id: rpt.string.isRequired,
      wrapper: rpt.object
    },

    getInitialState() {
      return {
        kpisAreExpanded: false
      };
    },

    render() {
      const snapshotId = this.props.id;
      if (!snapshotId) {
        return null;
      }

      this.props.wrapper.style.zIndex = this.state.kpisAreExpanded ? 1 : 0;

      return <KPIList snapshotId={snapshotId} onExpand={kpisAreExpanded => this.setState({ kpisAreExpanded })} />;
    }
  })
);
