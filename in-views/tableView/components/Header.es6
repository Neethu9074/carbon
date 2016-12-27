import React from 'react';

import {clearSelectedSnapshots} from 'in-views/tableView/stores/selectedSnapshots';
import MetricSelector from 'in-views/tableView/components/MetricSelector';
import TypeSelector from 'in-views/tableView/components/TypeSelector';
import {clearMetrics} from 'in-views/tableView/stores/metrics';
import Button from 'in-components/Button';

import './Header.less';

const block = 'in-table-view-header';

export default function Header() {
  return (
    <header className={block}>
      <div className={`${block}__left-side`}>
        <TypeSelector />

        <MetricSelector />
      </div>

      <Button kind='secondary'
              size='sm'
              onClick={clearSelection}>
        Clear Selections
      </Button>
    </header>
  );
}

function clearSelection() {
  clearMetrics();
  clearSelectedSnapshots();
}
