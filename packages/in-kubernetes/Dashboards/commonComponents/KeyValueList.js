/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortBy } from 'lodash';
import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import KeyValue from 'in-new-components/lists/KeyValue/KeyValue';
import { Li, Ul } from 'in-new-components/lists/List';
import Card from 'in-new-components/Card';

export default function KeyValueList({ title, items, onEmptyText }) {
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
      <Ul>
        {sortBy(items, item => item.key).map((item, key) => (
          <Li key={key}>
            <KeyValue value={item.value} label={item.key} />
          </Li>
        ))}
      </Ul>
    </Card>
  );
}
