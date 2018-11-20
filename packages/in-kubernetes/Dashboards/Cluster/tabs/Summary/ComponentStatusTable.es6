import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import { deepCopy } from 'in-services/util/object';
import { compare } from 'in-services/util/boolean';
import SvgIcon from 'in-components/SvgIcon';
import Card from 'in-new-components/Card';

import locals from './ComponentStatusTable.mless';

export default function ComponentStatusTable({ cluster }) {
  return (
    <Card title="Component Statuses">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Health</Th>
            <Th>Component</Th>
            <Th>Message</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(deepCopy(cluster.componentStatuses) || [])
            .sort((a, b) => compare(a.healthy, b.healthy))
            .map((componentStatus, i) => (
              <Tr key={i} size="compact">
                <Td>
                  {componentStatus.healthy ? (
                    <SvgIcon type="lib_check" width={24} className={locals.okayIcon} />
                  ) : (
                    <SvgIcon type="lib_help_error_warning" width={24} className={locals.warningIcon} />
                  )}
                </Td>
                <Td>{componentStatus.name}</Td>
                {!componentStatus.healthy && <Td>{componentStatus.message}</Td>}
                {componentStatus.healthy && <Td />}
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Card>
  );
}
