/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import EntityListPresenter from 'in-infrastructure/Explore/components/EntityListPresenter';
import { nonServicePlugins } from 'in-forge/constants';

export default {
  component: EntityListPresenter
};

export function List() {
  const items = Object.keys(nonServicePlugins)
    .sort()
    .map(plugin => ({
      tags: {
        type: plugin
      },
      count: Math.floor(Math.random() * 1000),
      metrics: {}
    }));
  const [filter, setFilter] = useState('');

  return (
    <>
      <h2>List of all plugins</h2>
      <EntityListPresenter
        order={{ by: 'name', direction: 'ASC' }}
        onChange={change => setFilter(change.query)}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: items.filter(item => item.tags.type.includes(filter)),
            page: 1
          }
        }}
      />
    </>
  );
}
