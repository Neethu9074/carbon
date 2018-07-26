import React from 'react';

import List from 'in-analyze/Analyze/components/QuickFilter/List';

import locals from './TypeSuggestions.mless';

export default function TypeSuggestions(props) {
  return (
    <div className={locals.wrapper}>
      <List
        {...props}
        items={['Batch', 'Database', 'Http', 'Messaging', 'Rpc', 'Undefined'].map(label => ({ label }))}
      />
    </div>
  );
}
