import React from 'react';

import { Table, Tbody, Tr, Td } from 'in-components/tables/sharedComponents';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import Card from 'in-new-components/Card';

export default function LabelsList({ labels }) {
  return (
    <Card title="Labels">
      <Table tableInCard>
        <Tbody>
          {(labels || []).map((label, i) => (
            <Tr key={i} size="compact">
              <Td>
                <EntityWithTypeAndIcon label={label.value} type={label.key} iconType="lib_kubernetes_label" />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Card>
  );
}
