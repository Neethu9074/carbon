import React from 'react';

import PhysicalTableViewContent from 'in-components/tableView/components/PhysicalTableViewContent';
import {isTableVisible$} from 'in-components/tableView/tableViewStore';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';
import {view$, types} from 'in-stores/view';

import './TableView.less';

const block = 'in-table-view';

export default connectTo({
    isTableVisible: isTableVisible$,
    isCollapsed: isCollapsed$,
    view: view$
  }, function TableView({isTableVisible, isCollapsed, view}) {
    if (!isTableVisible) {
      return null;
    }

    let classes = block;

    if (!isCollapsed) {
      classes += ' ' + block + '--timeline-expanded';
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
