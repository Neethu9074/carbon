import rpt from 'prop-types';
import React from 'react';

import KPIList from 'in-map/components/stickyNotes/logical/Service/components/KPIList';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';

export default createStickyNote(
  class extends React.Component {
    static displayName = 'logical connection sticky';

    static propTypes = {
      id: rpt.string.isRequired,
      wrapper: rpt.object
    };

    state = {
      kpisAreExpanded: false
    };

    render() {
      const snapshotId = this.props.id;
      if (!snapshotId) {
        return null;
      }

      this.props.wrapper.style.zIndex = this.state.kpisAreExpanded ? 1 : 0;

      return <KPIList snapshotId={snapshotId} onExpand={kpisAreExpanded => this.setState({ kpisAreExpanded })} />;
    }
  }
);
