/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import Input from 'in-components/SearchBar/Input';

export default {
  component: Input,
  args: {
    width: 400
  }
};

export const InputSearchBar = args => {
  const [contextQuery, setContextQuery] = useState({ query: '' });
  return <Input onChange={query => setContextQuery({ query: query })} contextQuery={contextQuery} {...args} />;
};

// options will not be listed with disabled
export const InputWithDisabled = args => {
  const [contextQuery, setContextQuery] = useState({ query: '' });
  return <Input onChange={query => setContextQuery({ query: query })} contextQuery={contextQuery} disabled {...args} />;
};

export const InputWithManageFiltersDisabled = args => {
  const [contextQuery, setContextQuery] = useState({ query: '' });
  return (
    <Input
      onChange={query => setContextQuery({ query: query })}
      contextQuery={contextQuery}
      manageFiltersDisabled
      onQueryValueChange={value => setContextQuery({ query: value })}
      {...args}
    />
  );
};
