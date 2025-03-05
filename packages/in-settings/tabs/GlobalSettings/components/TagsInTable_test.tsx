/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import ResizeObserver from 'resize-observer-polyfill';
import { render } from '@testing-library/react';
import React from 'react';

import TagsInTable from 'in-settings/tabs/GlobalSettings/components/TagsInTable';
import { TeamTag } from 'in-types';
global.ResizeObserver = ResizeObserver;

describe('TagsInTable', () => {
  it('renders without crashing and have tags text', () => {
    const tags = [
      { displayName: 'Tag1', id: 'blue' },
      { displayName: 'Tag2', id: 'green' }
    ];
    const { container, getAllByText } = render(<TagsInTable tags={tags} />);
    expect(container).toBeInTheDocument();
    expect(getAllByText('Tag1')).toHaveLength(2);
    expect(getAllByText('Tag2')).toHaveLength(2);
  });

  it('renders with empty tags', () => {
    const tags: TeamTag[] = [];
    const { container } = render(<TagsInTable tags={tags} />);
    expect(container).toBeEmptyDOMElement();
  });
});
