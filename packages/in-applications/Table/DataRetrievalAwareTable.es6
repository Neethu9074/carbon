// @flow

import { compose, withState } from 'recompose';

import Table from 'in-applications/Table';
import connect from 'in-hoc/connectTo';

export default compose(
  withState('tableState', 'onStateChanged', null),
  connect(({tableState, get}) => ({
    result: tableState != null ? get(tableState) : null
  }))
)(Table);
