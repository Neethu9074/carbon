import Select from 'react-select';
import React from 'react';

import { groupSorting$, setGroupSorting } from 'in-views/traceAnalyticsView/stores/groupSorting';
import connectTo from 'in-hoc/connectTo';

import './GroupingSorterSelectBox.less';

const block = 'in-trace-analytics-group-sorting-select';

export default connectTo(
  {
    groupSorting: groupSorting$
  },
  function GroupingSorterSelectBox({ groupSorting }) {
    return (
      <Select
        options={[
          { value: 'calls', label: 'Calls' },
          { value: 'total', label: 'Total' },
          { value: 'errors', label: 'Errors' }
        ]}
        className={block}
        value={groupSorting}
        clearable={false}
        onChange={e => setGroupSorting(e ? e.value : null)}
      />
    );
  }
);
