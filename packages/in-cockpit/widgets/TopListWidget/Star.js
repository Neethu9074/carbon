/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { IconButton } from '@instana/components';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';

import locals from './Star.mless';

export default function Star({ pinned, onClick }) {
  return (
    <IconButton
      className={locals.starIcon}
      kind={pinned ? 'warning' : 'action'}
      type={pinned ? 'lib_actions_star_filled' : 'lib_actions_star'}
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
    />
  );
}
