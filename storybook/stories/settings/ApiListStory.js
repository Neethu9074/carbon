import { storiesOf } from '@storybook/react';
import React from 'react';

import ApiListRenderer from 'in-settings/components/ApiList/ApiListRenderer';
import { Ul, Li } from 'in-new-components/lists/List';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Settings/API data driven list', module)
  .add('loading & empty', () => <LoadingAndEmptyStory />)
  .add('with data', () => <WithDataStory />)
  .add('with message', () => <WithMessageStory />);

function LoadingAndEmptyStory() {
  return (
    <Root>
      <Section title="loading">
        <ApiListRenderer isLoadingItems itemName="Foobar" />
      </Section>

      <Section title="empty">
        <ApiListRenderer itemName="Foobar" items={[]} />
      </Section>
    </Root>
  );
}

function WithDataStory() {
  return (
    <Root>
      <ApiListRenderer
        itemName="Foobar"
        items={[{ id: 'f', label: 'foo' }, { id: 'f2', label: 'foo2' }, { id: 'b', label: 'bar' }]}
        searchFields={['label']}
        query="foo"
        ListRenderer={ListRenderer}
      />
    </Root>
  );
}

function WithMessageStory() {
  return (
    <Root>
      <Section title="empty">
        <ApiListRenderer
          itemName="Foobar"
          items={[{ id: 'f', label: 'foo' }, { id: 'f2', label: 'foo2' }, { id: 'b', label: 'bar' }]}
          searchFields={['label']}
          query=""
          message={{ type: 'info', message: 'great success!' }}
          retainMessagesAfter={10000000}
          ListRenderer={ListRenderer}
        />
      </Section>

      <Section title="empty">
        <ApiListRenderer
          itemName="Foobar"
          items={[{ id: 'f', label: 'foo' }, { id: 'f2', label: 'foo2' }, { id: 'b', label: 'bar' }]}
          searchFields={['label']}
          query=""
          message={{ type: 'error', message: 'no success!' }}
          retainMessagesAfter={10000000}
          ListRenderer={ListRenderer}
        />
      </Section>
    </Root>
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
