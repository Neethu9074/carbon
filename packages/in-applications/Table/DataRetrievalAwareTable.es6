// @flow

import { compose, withState } from 'recompose';
import React from 'react';

import connect from 'in-hoc/connectTo';

// import Table from 'in-applications/Table';

export default compose(
  withState('tableConfig', 'onTableConfigChange', null),
  connect(({tableConfig, get}) => ({
    result: tableConfig != null ? get(tableConfig) : null
  }))
)(DataRetrievalAwareTable);


function DataRetrievalAwareTable(/*{onTableConfigChange, tableConfig, result}*/) {
  // console.log({onTableConfigChange, tableConfig, result});
  return (
    <div>
      Hello from ResultAwareTable!
    </div>
  );
}
