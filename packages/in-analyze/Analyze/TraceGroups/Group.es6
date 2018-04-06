import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';
import { assign, get } from 'lodash';

import { Tr, Td, Link } from 'in-components/tables/sharedComponents';
import { number, millis } from 'in-services/formatters/number';
import Traces from 'in-analyze/Analyze/TraceGroups/Traces';

export default compose(withState('expanded', 'setExpanded', false))(Group);

function Group({ setExpanded, expanded, item, orderBy, orderDirection, filter, depth }) {
  const filterWithGroupName = assign({}, filter);
  filterWithGroupName.traceGroupName = item.name;
  return (
    <Fragment>
      <Tr depth={depth}>
        <Td>
          <Link
            href=""
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {item.name}
          </Link>
        </Td>
        <Td>{number.compact(get(item, ['metrics', 'calls', 0, 1]))}</Td>
        <Td>{millis.fixedCompact(get(item, ['metrics', 'duration', 0, 1]))}</Td>
        <Td>{number.compact(get(item, ['metrics', 'errors', 0, 1]))}</Td>
      </Tr>
      {expanded &&
        <Traces orderBy={orderBy} orderDirection={orderDirection} filter={filterWithGroupName} depth={depth + 1} />
      }
    </Fragment>
  );
}
