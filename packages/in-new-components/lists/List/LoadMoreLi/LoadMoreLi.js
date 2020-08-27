import React from 'react';

import { Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

import locals from './LoadMoreLi.mless';

export default function LoadMoreLi({ loadMore, label = 'Load More' }) {
  return (
    <Li>
      <div className={locals.wrapper}>
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
      </div>
    </Li>
  );
}
