/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TagSet } from '@instana/ibm-products';

import { TeamTag } from 'in-types';

import locals from './TagsInTable.mless';

interface TITProps {
  tags: TeamTag[];
}

export default function TagsInTable({ tags }: TITProps) {
  if (tags.length > 0) {
    return (
      <div className={locals.tagsContainer}>
        <TagSet
          tags={tags.map(item => {
            return { label: item.displayName, type: 'blue', size: undefined };
          })}
        />
      </div>
    );
  }
  return null;
}
