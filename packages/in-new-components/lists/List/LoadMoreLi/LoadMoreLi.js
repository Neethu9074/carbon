import React from 'react';

import { Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

export default function LoadMoreLi({ loadMore, label = 'Load More' }) {
  return (
    <Li>
      <Button
        kind="action"
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          loadMore();
        }}
      >
        {label}
      </Button>
    </Li>
  );
}
