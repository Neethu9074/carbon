/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortBy } from 'lodash';
import React from 'react';

import { KeyValue, Typography, Li, Ul } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';

export default function KeyValueList({ title, items, onEmptyText }) {
  if (!items || items.length === 0) {
    if (!onEmptyText) {
      return null;
    }

    return (
      <>
        <Typography variant="heading-03">{title}</Typography>
        <NoDataAvailable height={160} text={onEmptyText} />
      </>
    );
  }

  return (
    <>
      <Typography variant="heading-03">{title}</Typography>
      <Ul>
        {sortBy(items, item => item.key).map((item, key) => (
          <Li key={key}>
            <KeyValue value={item.value} label={item.key} />
          </Li>
        ))}
      </Ul>
    </>
  );
}
