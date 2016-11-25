import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import Tag from 'in-components/Tag';

export default function TagList({snapshot}) {
  const tags = snapshot.get('processorTags');
  if (!tags || tags.size === 0) {
    return null;
  }

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Tags ({tags.size})</Collapsible.Header>
        <Collapsible.Content>
          {tags.toArray().map((tag) =>
            <Tag key={tag}
                 tag={tag} />
          )}
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
