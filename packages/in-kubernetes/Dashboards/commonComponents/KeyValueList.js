/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { Li, Ul } from 'in-new-components/lists/List';
import Card from 'in-new-components/Card';

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

  const itemsWithIcon = items
    .map(({ key, value }) => ({ key, value, icon }))
    .sort((a, b) => a.key.localeCompare(b.key));

  return (
    <Card title={title}>
      <Ul>
        {itemsWithIcon.map((item, key) => (
          <Li key={key}>
            <EntityWithTypeAndIcon label={item.value} type={item.key} iconType={item.icon} />
          </Li>
        ))}
      </Ul>
    </Card>
  );
}
