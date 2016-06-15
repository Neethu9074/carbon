import React from 'react';

import PhysicalTableViewContent from 'in-components/tableView/components/PhysicalTableViewContent';
import {isOpen$ as isSidebarOpen$} from 'in-components/sidebars/Map/sidebarStore';
import {isTableVisible$} from 'in-components/tableView/stores/visibility';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';
import {view$, types} from 'in-stores/view';

import './TableView.less';

const block = 'in-table-view';

export default connectTo({
    isTableVisible: isTableVisible$,
    isCollapsed: isCollapsed$,
    view: view$,
    isSidebarOpen: isSidebarOpen$
  }, function TableView({isTableVisible, isCollapsed, view, isSidebarOpen}) {
    if (!isTableVisible) {
      return null;
    }

    let classes = block;

    if (!isCollapsed) {
      classes += ' ' + block + '--timeline-expanded';
    }

    if (isSidebarOpen) {
      classes += ' ' + block + '--sidebar-open';
    }

    let content;
    if (view === types.physical) {
      content = <PhysicalTableViewContent />;
    } else {
      return null;
    }

    return (
      <div className={classes}>
        {content}
      </div>
    );
  }
);
