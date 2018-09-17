import React from 'react';

import List from 'in-analyze/AnalyzeView/components/QuickFilter/List';

import locals from './TypeSuggestions.mless';

export default function TypeSuggestions(props) {
  return (
    <div className={locals.wrapper}>
      <List
        {...props}
        items={['Batch', 'Database', 'Http', 'Messaging', 'Rpc', 'Undefined'].map(item => ({
          value: item,
          label: item
        }))}
      />
    </div>
  );
}
