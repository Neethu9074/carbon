import React from 'react';

import {collapseAll, expandAll} from 'in-components/tableView/stores/expandedIds';
import Icon from 'in-components/Icon';

import './ExpandCollapseAll.less';

const block = 'in-table-view-expand-collapse';

export default function ExpandCollapseAll() {
  return (
    <div className={block}>
      <span onClick={expandAll}
            className={block + '__expand'}>
        <Icon type='close'
              className={block + '__expand-icon'}/>
        <span>Expand</span>
      </span>

      <span onClick={collapseAll}
            className={block + '__collapse'}>
        <Icon type='close'
              className={block + '__collapse-icon'}/>
        <span>Collapse</span>
      </span>
    </div>
  );
}
