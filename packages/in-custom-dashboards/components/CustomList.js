import React from 'react';

// TODO requires in-internal data!
import { LinkList, LinkListItem } from 'in-internal/components/LinkList/LinkList';
import Card from 'in-new-components/Card';

export default function CustomList({ panel }) {
  const { title } = panel;
  return (
    <Card title={title}>
      <ListNode props={panel} />
    </Card>
  );
}

function ListNode({ props }) {
  let childNodes;

  const { title, label, description, items } = props;

  if (items != null) {
    childNodes = items.map((node, index) => {
      return <ListNode key={index} props={node} />;
    });

    // handles case for the root component that isn't an sublist item
    if (title) {
      return <LinkList>{childNodes}</LinkList>;
    }

    return (
      <LinkListItem label={label} description={description}>
        <LinkList>{childNodes}</LinkList>
      </LinkListItem>
    );
  }

  const { href } = props;
  return <LinkListItem label={label} href={href} external description={description} />;
}
