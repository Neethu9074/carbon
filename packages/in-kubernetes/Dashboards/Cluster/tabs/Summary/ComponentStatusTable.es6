import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from 'in-components/tables/sharedComponents';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Card from 'in-new-components/Card';

import locals from './ComponentStatusTable.mless';

export default function ComponentStatusTable({ cluster }) {
  return (
    <Card title="Component Statuses">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Component</Th>
            <Th>Healthy</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(cluster.componentStatuses || []).map((componentStatus, i) => (
            <Tr key={i} size="compact">
              <Td>{componentStatus.name}</Td>
              <Td>
                {componentStatus.healthy ? (
                  <SvgIcon type="lib_check" width={24} className={locals.okayIcon} />
                ) : (
                  <Tooltip themeStyle="light" content={componentStatus.message}>
                    <SvgIcon type="lib_help_error_warning" width={24} className={locals.warningIcon} />
                  </Tooltip>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
