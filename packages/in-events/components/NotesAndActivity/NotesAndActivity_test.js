/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

// import { CommentInput } from 'in-events/components/NotesAndActivity/components/CommentInput';
// import { QuickActions } from 'in-events/components/NotesAndActivity/components/QuickActions';
import { CommentList, ChatBubble } from 'in-events/components/NotesAndActivity/components/CommentList';

// import { SvgIcon } from '@instana/components';

// import locals from './NotesAndActivity.mless';

describe('ChatBubble', () => {
  it('renders without errors', () => {
    shallow(<ChatBubble />);
  });
});

describe('CommentList', () => {
  it('renders without errors', () => {
    shallow(<CommentList />);
  });
});
