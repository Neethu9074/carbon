import React from 'react';

import { Td, Table, Thead, Tbody, Tr, Th } from 'in-components/tables/sharedComponents';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ContainerStates.mless';

export default function ContainerStates({ states }) {
  if (!states) {
    return null;
  }

  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th>Name</Th>
          <Th>Ready</Th>
          <Th>Status</Th>
          <Th>Message</Th>
        </Tr>
      </Thead>
      <Tbody>
        {states.map((state, i) => (
          <Tr key={i}>
            <Td>{state.name}</Td>
            <Td>
              <SvgIcon
                className={evaluateClassNames({
                  [locals.ready]: state.ready,
                  [locals.notReady]: !state.ready
                })}
                type={state.ready ? 'lib_check' : 'lib_openclose_cancel'}
                width={24}
                height={24}
              />
            </Td>
            <Td>-</Td>
            <Td>-</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
