/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Ul, Li } from '@instana/components';

import { DefaultListRenderer } from 'in-settings/components/ApiList/renderer/renderer';

export default {
  component: DefaultListRenderer
};

export function LoadingAndEmptyStory() {
  return (
    <>
      <DefaultListRenderer
        itemName="Foobar"
        itemsResult={{
          progress: {
            loading: true
          }
        }}
      />
      <DefaultListRenderer
        itemName="Foobar"
        itemsResult={{
          data: []
        }}
      />
    </>
  );
}

export function WithDataStory() {
  return (
    <DefaultListRenderer
      itemName="Foobar"
      itemsResult={{
        data: [
          { id: 'f', label: 'foo' },
          { id: 'f2', label: 'foo2' },
          { id: 'b', label: 'bar' }
        ]
      }}
      searchFields={['label']}
      query="foo"
      ListRenderer={ListRenderer}
    />
  );
}

export function WithMessageStory() {
  return (
    <DefaultListRenderer
      itemName="Foobar"
      itemsResult={{
        data: [
          { id: 'f', label: 'foo' },
          { id: 'f2', label: 'foo2' },
          { id: 'b', label: 'bar' }
        ]
      }}
      searchFields={['label']}
      query=""
      message={{ type: 'warning', text: 'warning! weeep weeep!' }}
      retainMessagesAfter={10000000}
      ListRenderer={ListRenderer}
    />
  );
}

function ListRenderer({ items }) {
  return (
    <Ul>
      {items.map(item => (
        <Li key={item.id}>{item.label}</Li>
      ))}
    </Ul>
  );
}
