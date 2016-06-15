import React from 'react';

import {toggleTableViewVisibility, isTableVisible$} from 'in-components/tableView/stores/visibility';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import {isInternalEnvironment} from 'in-services/config';
import {view$, types} from 'in-stores/view';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TableViewToggleButton.less';

const block = 'in-table-view-toggle-button';

export default connectTo({
    isTableVisible: isTableVisible$,
    isCollapsed: isCollapsed$,
    view: view$
  }, function TableViewToggleButton({isTableVisible, isCollapsed, view}) {
    if (!isInternalEnvironment() || view !== types.physical) {
      return null;
    }

    let classes = block;
    if (isTableVisible) {
      classes += ' ' + block + '--visible';
    }

    if (!isCollapsed) {
      classes += ' ' + block + '--timeline-expanded';
    }

    return (
      <Tooltip align={{
                 vertical: 'middle',
                 horizontal: 'left'
               }}
               content='Switch between 3D view and tabular form.'>
        <Icon type='menue'
              onClick={toggleTableViewVisibility}
              className={classes} />
      </Tooltip>
    );
  }
);
