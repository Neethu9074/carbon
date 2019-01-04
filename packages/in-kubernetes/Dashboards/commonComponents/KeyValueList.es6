import React from 'react';

import { Table, Tbody, Tr, Td } from 'in-components/tables/sharedComponents';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Card from 'in-new-components/Card';

import locals from './KeyValueList.mless';

export default function KeyValueList({ title, items, icon, onEmptyText }) {
  if (!items || items.length === 0) {
    if (!onEmptyText) {
      return null;
    }

    return (
      <Card title={title}>
        <NoDataAvailable height={160} text={onEmptyText} />
      </Card>
    );
  }

  return (
    <Card title={title}>
      <Table className={locals.table} tableInCard>
        <Tbody>
          {items
            .slice()
            .sort((a, b) => a.key.localeCompare(b.key))
            .map(({ key, value }, i) => (
              <Tr key={i} size="compact">
                <Td>
                  <EntityWithTypeAndIcon label={value} type={key} iconType={icon} />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Card>
  );
}
