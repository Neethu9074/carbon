import React from 'react';

import { Table, Thead, Tbody, Th, Tr, Td } from 'in-components/tables/sharedComponents';
import WithIcon from 'in-new-components/WithIcon';
import Card from 'in-new-components/Card';

export default function PortsList({ ports }) {
  if (!ports || ports.length === 0) {
    return null;
  }

  return (
    <Card title="Ports">
      <Table tableInCard>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Port</Th>
            <Th>Protocol</Th>
            <Th>NodePort</Th>
            <Th>TargetPort</Th>
          </Tr>
        </Thead>
        <Tbody>
          {ports.map((portConfig, i) => (
            <Tr key={i} size="compact">
              <Td>
                <WithIcon icon="lib_kubernetes_port">{portConfig.name}</WithIcon>
              </Td>
              <Td>{portConfig.port}</Td>
              <Td>{portConfig.protocol}</Td>
              <Td>{portConfig.nodePort}</Td>
              <Td>{portConfig.targetPort}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
