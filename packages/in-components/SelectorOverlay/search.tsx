/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import Fuse, { FuseOptionKey, FuseResult, FuseResultMatch, IFuseOptions, RangeTuple } from 'fuse.js';
import React, { useMemo, Fragment } from 'react';

import { Highlights, Options, OptionsResult } from 'in-components/SelectorOverlay/Node';

import locals from './search.mless';

// when multiple tokens are found, favor diversity of matches against a single token which matches many keys
const MULTI_MATCH_BOOST = 0.001;

// when no score is attributed, it is likely a very bad match
const DEFAULT_SCORE = 1;

const keys: Array<FuseOptionKey<Options>> = [
  { name: 'label', weight: 2 },
  'description',
  'parentLabels',
  'tagName',
  'metric'
];

// minimum proportion of token to match upon
const minCharPercentage: number = 0.55; // at least half

const fuseOptions: IFuseOptions<Options> = {
  includeScore: true,
  includeMatches: true,
  findAllMatches: true,
  minMatchCharLength: 2,
  keys
};

export function useSearch<T extends Options>(
  options: T[],
  query: string,
  matchAllTokens: boolean = true
): OptionsResult<T>[] {
  const allOptions = useMemo(() => flattenNodes(options), [options]);
  const index = useMemo(() => Fuse.createIndex(keys, allOptions), [allOptions]);
  const fuse = useMemo(() => new Fuse(allOptions, fuseOptions, index), [allOptions, index]);
  const tokens = query.split(' ').filter(token => token.length > 0);
  return useMemo(
    () =>
      searchTokens(fuse, tokens, matchAllTokens)
        .sort((a, b) => scoreBoost(a) - scoreBoost(b))
        .map(result => ({
          ...result.item,
          withHighlights: highlights(result),
          score: result.score as number,
          matches: result.matches
        })),
    [tokens, fuse, matchAllTokens]
  );
}

function searchTokens<T extends Options>(fuse: Fuse<T>, tokens: string[], matchAllTokens: boolean): FuseResult<T>[] {
  return tokens
    .map(token => ({ token, results: fuse.search(token, { limit: 10000 }) }))
    .map(removeIndicesNotMatchingToken)
    .reduce(mergeResults<T>(matchAllTokens), []);
}

function removeIndicesNotMatchingToken<T extends Options>({
  token,
  results
}: {
  token: string;
  results: FuseResult<T>[];
}) {
  const minChars = Math.floor(token.length * minCharPercentage);
  return results
    .map(result => ({
      ...result,
      matches: result.matches
        ?.map(match => {
          if (!match.value) {
            return match;
          }
          return {
            ...match,
            indices: match.indices
              .filter(range => range[1] - range[0] >= minChars)
              .flatMap(range => {
                const matchValue = match.value!.toLowerCase().substring(range[0], range[1] + 1);
                const lowercasedToken = token.toLowerCase();
                if (lowercasedToken.includes(matchValue)) {
                  return [range];
                }
                const tokenOffset = matchValue.indexOf(lowercasedToken);
                if (tokenOffset !== -1) {
                  return [[tokenOffset + range[0], range[0] + lowercasedToken.length - 1] as RangeTuple];
                }
                return [];
              })
          };
        })
        .filter(match => match.indices.length > 0)
    }))
    .filter(result => result.matches && result.matches?.length > 0);
}

function mergeResultsForKey<T extends Options>(
  previous: FuseResult<T>[],
  current: FuseResult<T>[],
  extractKey: (option: T) => string | undefined,
  intersect: boolean = false
) {
  let commonKeys: string[] = [];
  if (intersect) {
    commonKeys = current.map(result => extractKey(result.item)).filter(Boolean) as string[];
    if (previous.length > 0) {
      const previousKeys = previous.map(result => extractKey(result.item)).filter(Boolean) as string[];
      commonKeys = commonKeys.filter(key => previousKeys.includes(key));
    }
  }

  const resultMap = new Map<string, FuseResult<T>>();

  function fillResultMapFrom(
    resultArray: FuseResult<T>[],
    callback: (key: string, result: FuseResult<T>) => void = (key, result) => resultMap.set(key, result)
  ) {
    for (const result of resultArray) {
      const key = extractKey(result.item);
      if (key && (!intersect || commonKeys.includes(key))) {
        callback(key, result);
      }
    }
  }

  if (previous.length === 0) {
    fillResultMapFrom(current);
  } else {
    fillResultMapFrom(previous);
    fillResultMapFrom(current, (key, result) => {
      const previousResult = resultMap.get(key);
      if (previousResult) {
        resultMap.set(key, {
          ...result,
          matches: mergeMatches(previousResult?.matches, result.matches),
          score: mergeScores(previousResult?.score, result.score)
        });
      } else {
        resultMap.set(key, result);
      }
    });
  }

  return resultMap;
}

function mergeResults<T extends Options>(matchAllTokens: boolean) {
  return (previous: FuseResult<T>[], current: FuseResult<T>[]) => {
    const extractKey = (options: T) => getKey(options);
    const mergedTags = mergeResultsForKey(previous, current, extractKey, matchAllTokens);
    return [...mergedTags.values()];
  };
}

export function getKey(options: Options) {
  if (options.children && options.children.length > 0) {
    return options.levelType ? `${options.levelType}-${options.label}` : options.label;
  }
  if (options.type === 'APPLICATION' || options.type === 'SERVICE' || options.type === 'ENDPOINT') {
    return options.label ?? null;
  }
  return options.type === 'TAG' ? options.tagName : `${options.levelType}-${options.metric}`;
}

function mergeScores(previousScore: number = DEFAULT_SCORE, currentScore: number = DEFAULT_SCORE) {
  return previousScore * currentScore * MULTI_MATCH_BOOST;
}

function mergeMatches(
  previousMatch: readonly FuseResultMatch[] = [],
  currentMatch: readonly FuseResultMatch[] = []
): FuseResultMatch[] {
  const matches = new Map<string, FuseResultMatch>();

  for (const match of previousMatch) {
    if (match.key) {
      matches.set(`${match.key}${match.refIndex}`, match);
    }
  }

  for (const match of currentMatch) {
    if (match.key) {
      const previousMatch = matches.get(`${match.key}${match.refIndex}`);
      matches.set(`${match.key}${match.refIndex}`, {
        ...match,
        indices: mergeIndices(match.value?.length, previousMatch?.indices, match.indices)
      });
    }
  }

  return Array.from(matches.values());
}

function mergeIndices(
  length: number = 0,
  previousIndices: readonly RangeTuple[] = [],
  currentIndices: readonly RangeTuple[] = []
): RangeTuple[] {
  if (length === 0) {
    return [];
  }
  const mask = new Array<boolean>(length);
  mask.fill(false, 0, length);
  for (const index of previousIndices) {
    mask.fill(true, index[0], index[1]);
  }
  for (const index of currentIndices) {
    mask.fill(true, index[0], index[1]);
  }

  let nextMask: boolean = true;
  let start: number = 0;
  const indices: RangeTuple[] = [];
  for (let index = 0; index < length; index++) {
    if (mask[index] !== nextMask) {
      continue;
    }
    if (nextMask) {
      // found start of mask
      start = index;
    } else {
      // found end of mask
      indices.push([start, index]);
    }
    nextMask = !nextMask;
  }

  return indices;
}

function scoreBoost(result: FuseResult<Options>): number {
  const scoreBoost = result.item.scoreBoost ?? 1;
  const score = result.score ?? DEFAULT_SCORE;
  return score / scoreBoost;
}

function flattenNodes<T extends Options>(nodes: T[]): T[] {
  return nodes.flatMap((node: T) => {
    if (node.children && node.children.length > 0) {
      return flattenNodes(node.children as T[]);
    }
    return [node];
  });
}

function highlights(result: FuseResult<Options>): Highlights {
  if (!result.matches) {
    const {
      item: { label, description, parentLabels }
    } = result;

    return {
      label,
      description,
      parentLabels,
      tag: false,
      metric: false
    };
  }

  const { matches, item } = result;

  const label = matches.find(m => m.key === 'label');
  const description = matches.find(m => m.key === 'description');
  const parent0 = matches.find(m => m.key === 'parentLabels' && m.refIndex == 0);
  const parent1 = matches.find(m => m.key === 'parentLabels' && m.refIndex == 1);
  const tag = matches.find(m => m.key === 'tagName');
  const metric = matches.find(m => m.key === 'metric');

  return {
    label: label?.value ? highlight(label.value, label.indices) : item.label,
    description: description?.value ? highlight(description.value, description.indices) : item.description,
    parentLabels: [
      parent0?.value ? highlight(parent0.value, parent0.indices) : item.parentLabels?.[0] ?? '',
      parent1?.value ? highlight(parent1.value, parent1.indices) : item.parentLabels?.[1] ?? ''
    ],
    tag: !!tag,
    metric: !!metric
  };
}

function highlight(value: string, indices: readonly RangeTuple[]): JSX.Element {
  let position = 0;
  const elements: JSX.Element[] = [];
  const mergedIndices = mergeRanges(indices);

  for (const range of mergedIndices) {
    elements.push(<Fragment key={`t-${position}`}>{value.substring(position, range[0])}</Fragment>);
    elements.push(
      <span key={`h-${range[0]}`} className={locals.highlight}>
        {value.substring(range[0], range[1] + 1)}
      </span>
    );
    position = range[1] + 1;
  }

  if (position < value.length) {
    elements.push(<Fragment key="end">{value.substring(position)}</Fragment>);
  }

  return <>{elements}</>;
}

function mergeRanges(indices: readonly RangeTuple[]) {
  if (!indices.length) return [];

  const sortedIndices = [...indices].sort((a, b) => a[0] - b[0]);
  const mergedRanges = [sortedIndices[0]];

  for (let i = 1; i < sortedIndices.length; i++) {
    const [currentStart, currentEnd] = mergedRanges[mergedRanges.length - 1];
    const [nextStart, nextEnd] = sortedIndices[i];

    if (nextStart <= currentEnd + 1) {
      mergedRanges[mergedRanges.length - 1] = [currentStart, Math.max(currentEnd, nextEnd)];
    } else {
      mergedRanges.push(sortedIndices[i]);
    }
  }

  return mergedRanges;
}
