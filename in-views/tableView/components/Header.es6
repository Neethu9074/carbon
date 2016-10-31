import React from 'react';

import CloseTableViewButton from 'in-views/tableView/components/CloseTableViewButton';
import {plugin$, snapshotIds$} from 'in-views/tableView/stores/snapshotIds';
import MetricSelector from 'in-views/tableView/components/MetricSelector';
import HeaderTitle from 'in-views/tableView/components/HeaderTitle';
import {getPlural} from 'in-sdk/pluginName';
import connectTo from 'in-hoc/connectTo';

import './Header.less';

const block = 'in-table-view-header';

export default connectTo({
  plugin: plugin$,
  snapshotIds: snapshotIds$
}, function Header({plugin, snapshotIds}) {
  return (
    <header className={block}>
      <div className={`${block}__left-side`}>
        <HeaderTitle>
          {getPlural(plugin)} ({snapshotIds ? snapshotIds.length : 0})
        </HeaderTitle>

        <MetricSelector />
      </div>

      <CloseTableViewButton />
    </header>
  );
});
