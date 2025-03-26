/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import EntityListPresenter from 'in-infrastructure/Explore/components/EntityListPresenter';
import { nonServicePlugins } from 'in-forge/constants';
import { getPluginName } from 'in-sdk/pluginName';

export default {
  component: EntityListPresenter
};

export function List() {
  const items = Object.keys(nonServicePlugins).map(plugin => ({
    tags: {
      type: plugin
    },
    count: Math.floor(Math.random() * 1000),
    metrics: {}
  }));
  const [change, setChange] = useState({ query: '', orderBy: 'label', orderDirection: 'ASC' });

  return (
    <>
      <h2>List of all plugins</h2>
      <EntityListPresenter
        order={{ by: change.orderBy, direction: change.orderDirection }}
        onChange={setChange}
        result={{
          progress: {
            loading: false
          },
          errors: [],
          data: {
            items: items
              .filter(item => item.tags.type.includes(change.query ?? ''))
              .sort((a, b) => {
                if (change.orderBy === 'label') {
                  return change.orderDirection === 'ASC'
                    ? getPluginName(a.tags.type).localeCompare(getPluginName(b.tags.type))
                    : getPluginName(b.tags.type).localeCompare(getPluginName(a.tags.type));
                }
                return change.orderDirection === 'ASC' ? a.count - b.count : b.count - a.count;
              })
              .map(item => ({
                ...item,
                label: getPluginName(item.tags.type)
              })),
            page: 1
          }
        }}
      />
    </>
  );
}
