/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { each, map, flatMap, values } from 'lodash';
import React from 'react';

import { themes } from '@instana/design-tokens';

import { Placeholder } from 'in-alerting/smart-alerts/utils/commonPlaceholderConstants';
import { Chunk, PARAMETER, toChunks } from 'in-services/util/stringToChunks';

export type HighlightedPlaceholders = (string | JSX.Element)[];

interface HighlightedChunk extends Omit<Chunk, 'value'> {
  value: string | HighlightedPlaceholders;
}

/*
 * Replaces the placeholders with respective markup.
 *
 * @param placeholders allowed placeholders
 * @param text containing placeholders which should be enhanced with markup to highlight them.
 * @param replacer Function returning the value which respective placeholder should be replaced with
 * @returns Containing the string enhanced with HTML elements and CSS styl
 */

export function replacePlaceholdersWithMarkup(
  placeholders: ReadonlyArray<Readonly<Placeholder>>,
  text: string,
  replacer: ({
    template,
    name,
    i
  }: {
    template: string;
    name: string;
    i: number;
  }) => string | HighlightedPlaceholders = highlightPlaceholderReplacer
): HighlightedPlaceholders {
  let chunks: HighlightedChunk[] = toChunks(text, map(placeholders, 'template'));

  let i = 0;
  each(values(placeholders), ({ template, name }: Placeholder) => {
    each(chunks, chunk => {
      if (chunk.type === PARAMETER && chunk.value === template) {
        chunk.value = replacer({ template, name, i });
        i += 1;
      }
    });
  });

  return flatMap(chunks, chunk => chunk.value);
}

function highlightPlaceholderReplacer({ template, i }: { template: string; i: number }): HighlightedPlaceholders {
  return [
    '${',
    <span key={`${i}`} style={{ color: themes.default.ids.color.option.pink['500'] }}>
      {removePlaceholderSpecificCharacters(template)}
    </span>,
    '}'
  ];
}

function removePlaceholderSpecificCharacters(placeholderValue: string): string {
  return placeholderValue.replace(/[${}]/g, '');
}
