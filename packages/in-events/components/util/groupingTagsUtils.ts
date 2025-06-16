/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ApiTag, TagType } from 'in-types';

export function convertGroupingTagTypes(
  groupingTags: Record<string, string>,
  tags: ApiTag[] | undefined
): Record<string, string | number> {
  const tagTypeMap: Record<string, TagType> = {};

  if (tags) {
    tags.forEach(tag => {
      tagTypeMap[tag.name] = tag.type;
    });
  }

  return Object.fromEntries(
    Object.entries(groupingTags).map(([key, value]) => {
      const type = tagTypeMap[key];

      if (type === 'NUMBER' || (!type && key.endsWith('.count'))) {
        const num = Number(value);
        return [key, isNaN(num) ? value : num];
      }

      return [key, value];
    })
  );
}
