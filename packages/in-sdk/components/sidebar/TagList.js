/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Tag from 'in-sdk/components/sidebar/Tag';

import locals from './TagList.mless';

export default function TagList({ snapshot }) {
  const tags = snapshot.get('processorTags');
  if (!tags || tags.size === 0) {
    return null;
  }

  return (
    <div>
      <Collapsible initiallyOpen={false}>
        <Collapsible.Header>Tags ({tags.size})</Collapsible.Header>
        <Collapsible.Content>
          <div className={locals.tagList}>
            {tags.toArray().map(tag => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}
