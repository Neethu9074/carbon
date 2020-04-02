import React from 'react';

import { warning } from 'in-new-components/Message/types';
import ApiListRenderer from 'in-settings/components/ApiList/ApiListRenderer';
import { Ul, Li } from 'in-new-components/lists/List';

export default {
  title: 'Organisms|ApiList',
  component: ApiListRenderer
};

export function LoadingAndEmptyStory() {
  return (
    <>
      <ApiListRenderer
        itemName="Foobar"
        itemsResult={{
          progress: {
            loading: true
          }
        }}
      />
      <ApiListRenderer
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
    <ApiListRenderer
      itemName="Foobar"
      itemsResult={{
        data: [{ id: 'f', label: 'foo' }, { id: 'f2', label: 'foo2' }, { id: 'b', label: 'bar' }]
      }}
      searchFields={['label']}
      query="foo"
      ListRenderer={ListRenderer}
    />
  );
}

export function WithMessageStory() {
  return (
    <ApiListRenderer
      itemName="Foobar"
      itemsResult={{
        data: [{ id: 'f', label: 'foo' }, { id: 'f2', label: 'foo2' }, { id: 'b', label: 'bar' }]
      }}
      searchFields={['label']}
      query=""
      message={{ type: warning, text: 'warning! weeep weeep!' }}
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
