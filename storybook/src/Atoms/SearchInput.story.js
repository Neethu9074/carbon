/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import SearchInput from 'in-new-components/SearchInput';

export default {
  title: 'Atoms|FormControl/SearchInput',
  component: SearchInput
};

export const Default = props => {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      onChange={query => props.setQuery?.(query) ?? setQuery(query)}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onReturn={action('onReturn')}
      query={props?.query ?? query}
      maxWidth={200}
      placeholder="default"
      {...props}
    />
  );
};

export const AutoFocus = props => {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      onChange={query => props?.setQuery(query) ?? setQuery(query)}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onReturn={action('onReturn')}
      query={props?.query ?? query}
      maxWidth={200}
      placeholder="default"
      autoFocus
      {...props}
    />
  );
};

export const Disabled = () => {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      onChange={query => setQuery(query)}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onReturn={action('onReturn')}
      query={query}
      maxWidth={200}
      placeholder="disabled"
      autoFocus
      disabled
    />
  );
};
export const Erroneus = () => {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      onChange={query => setQuery(query)}
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onReturn={action('onReturn')}
      query={query}
      maxWidth={200}
      placeholder="hasError"
      autoFocus
      hasError
    />
  );
};
