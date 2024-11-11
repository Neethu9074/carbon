/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useMemo } from 'react';
import { SyntaxNode, Tree } from '@lezer/common';

import {
  GetTagSetsQuery,
  GetTagSetsResponse,
  GetTagSetsResponseTag,
  GetTagSetsResponseTagSet,
  LogicalOperator,
  SummarizeGroup,
  SummarizeTagSetsQuery,
  SummarizeTagSetsResponse,
  TagFilter,
  TagFilterExpressionElementUnion,
  TagFilterOperator,
  TagSetSource
} from '@instana/types';
import { DataTable as CarbonDataTable, Code } from '@instana/components';
import { formatTime } from '@instana/format-date';
import { useObservable } from '@instana/hooks';

import { buildJsonParser, buildJsonSerializer, setOrDeleteMatrixParameter } from 'in-stores/navigation/matrix';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { sourceOptions } from 'in-internal/thisUnit/TagProcessor/sources';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { parser } from 'in-internal/thisUnit/TagProcessor/ql.grammar';
import memoize from 'in-services/util/memoizingObservableGenerator';
import ComboBox, { Option } from 'in-components/ComboBox/ComboBox';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Input from 'in-components/form/Input/Input';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import http from 'in-services/http';

import locals from './TagSets.mless';

export const path = '/tagSets';

const queryParameter = {
  path,
  name: 'query',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(''),
  initialState: ''
};

const sourceParameter = {
  path,
  name: 'source',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(),
  initialState: undefined
};

export default function TagSets() {
  const [state, setState] = useUrlState<{ query: string; source: string }>({
    bind: [queryParameter, sourceParameter]
  });

  const query = useDebouncedValue(state.query, query => setState({ query }));

  const expression = useMemo(() => {
    try {
      const tree = parser.parse(state.query);
      return treeToExpression(tree, state.query);
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : 'Unknown error',
        groupBy: [],
        filter: EMPTY_EXPRESSION
      };
    }
  }, [state.query]);

  const timeConfig = useTimeConfig();

  const summaryResult = useTagSetSummary({
    groupBy: expression.groupBy,
    tagFilterExpression: expression.filter,
    timeConfig,
    source: state.source?.toLocaleUpperCase() as TagSetSource,
    size: 20
  });

  const tagSets = useTagSets({
    tagFilterExpression: expression.filter,
    timeConfig,
    source: state.source?.toLocaleUpperCase() as TagSetSource,
    size: 20
  });

  return (
    <div className={locals.view}>
      <div className={locals.inputs}>
        <Input
          className={locals.input}
          type="text"
          id="query"
          placeholder={'Enter query (e.g. host.name = foo group by zone)'}
          value={query.value}
          onChange={e => query.onChange(e.target.value)}
          autoFocus
        />
        <ComboBox
          options={sourceOptions}
          value={state.source}
          onChange={e => setState({ source: (e && (e as Option))?.value })}
          isClearable
        />
      </div>
      {'error' in expression && expression.error && <div>{expression.error}</div>}
      {summaryResult.data && <TagSetsSummaryPresenter summary={summaryResult.data} expression={expression} />}
      {tagSets.data && <TagSetsPresenter response={tagSets.data} />}
    </div>
  );
}

function useTagSetSummary(query: SummarizeTagSetsQuery) {
  const stringifiedQuery = useMemo(() => JSON.stringify(query), [query]);
  return useObservable(() => summarizeTagSets(query), [stringifiedQuery]) ?? pendingResult;
}

function useTagSets(query: GetTagSetsQuery) {
  const stringifiedQuery = useMemo(() => JSON.stringify(query), [query]);
  return useObservable(() => getTagSets(query), [stringifiedQuery]) ?? pendingResult;
}

function TagSetsSummaryPresenter({
  summary,
  expression
}: {
  summary: SummarizeTagSetsResponse;
  expression: SummarizeExpression;
}) {
  const createLink = useLinkToState();
  const headers = [
    ...expression.groupBy.map(groupBy => ({ key: 'tag_' + groupBy, header: groupBy })),
    { key: 'count', header: 'count' }
  ];
  const rows =
    summary.groups?.map((group: SummarizeGroup) => ({
      id: JSON.stringify(group?.tags),
      ...Object.fromEntries(
        Object.entries(group?.tags ?? {}).map(([k, v]) => [
          'tag_' + k,
          <a
            href={createLink({
              query: expressionToQuery(
                removeGroupBy(
                  addFilter(expression, {
                    type: 'TAG_FILTER',
                    entity: 'NOT_APPLICABLE',
                    name: k,
                    operator: 'EQUALS',
                    value: v
                  }),
                  k
                )
              )
            })}
          >
            {v}
          </a>
        ])
      ),
      count: group.count
    })) ?? [];
  return <CarbonDataTable title="Counts" headers={headers} rows={rows} isSearchEnabled={false} />;
}

function TagSetsPresenter({ response }: { response: GetTagSetsResponse }) {
  const headers = [
    { key: 'tagSetId', header: 'id' },
    { key: 'from', header: 'from' },
    { key: 'lifetime', header: 'lifetime' },
    { key: 'diffs', header: 'diffs' }
  ];
  const rows = useMemo(
    () =>
      response.tagSets?.map((tagSet: GetTagSetsResponseTagSet, i: number, tagSets: GetTagSetsResponseTagSet[]) => {
        let diffs: TagDiff[] = [];
        if (i + 1 < tagSets.length) {
          const previous = tagSets[i + 1];
          diffs = getDiffs(previous, tagSet);
        }
        return {
          id: tagSet.id! + tagSet.from,
          tagSetId: (
            <Tooltip
              align="rightTop"
              themeStyle="light"
              content={
                <div className={locals.rawTagSet}>
                  <Code lang="json" code={JSON.stringify(tagSet, null, 2)} />
                </div>
              }
            >
              <>{tagSet.id}</>
            </Tooltip>
          ),
          from: formatTime(tagSet.from),
          lifetime: tagSet.to > 10 ** 18 ? 'online' : millis.detailed(tagSet.to - tagSet.from),
          diffs: <DiffsPresenter diffs={diffs} />
        };
      }) ?? [],
    [response]
  );
  return <CarbonDataTable title="Tag Sets" headers={headers} rows={rows} isSearchEnabled={false} />;
}

function getDiffs(previous: GetTagSetsResponseTagSet, next: GetTagSetsResponseTagSet): TagDiff[] {
  if (previous.id !== next.id) {
    return [];
  }
  const prevTags = collectTagsByKey(previous?.tags ?? []);
  const nextTags = collectTagsByKey(next?.tags ?? []);

  const keys = new Set([...Object.keys(prevTags), ...Object.keys(nextTags)]);

  return Array.from(keys)
    .map(key => {
      const prevValues = prevTags[key] ?? [];
      const nextValues = nextTags[key] ?? [];

      const added = nextValues.filter(v => !prevValues.includes(v));
      const removed = prevValues.filter(v => !nextValues.includes(v));

      return {
        key,
        added,
        removed
      };
    })
    .filter(d => d.added.length > 0 || d.removed.length > 0);
}

function DiffsPresenter({ diffs }: { diffs: TagDiff[] }) {
  return (
    <div>
      {diffs.map(diff => (
        <DiffPresenter diff={diff} />
      ))}
    </div>
  );
}

function DiffPresenter({ diff: { key, added, removed } }: { diff: TagDiff }) {
  const max = 3;
  const addedSummary = added.slice(0, max);
  const addedRest = added.length - max;
  const removedSummary = removed.slice(0, max);
  const removedRest = removed.length - max;
  return (
    <div className={locals.diffs}>
      <div className={locals.diff}>
        <div className={locals.key}>{key}:</div>
        <div className="changes">
          {addedSummary.map(addedTag => (
            <div className="added">{`+${addedTag}`}</div>
          ))}
          {removedSummary.map(removedTag => (
            <div className="removed">{`-${removedTag}`}</div>
          ))}
          <div className="changeOverflow">
            {addedRest > 0 && <div>{`+${addedRest} more`}</div>}
            {removedRest > 0 && <div>{`-${removedRest} more`}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

interface TagMap {
  [key: string]: string[];
}

function collectTagsByKey(tags: GetTagSetsResponseTag[]) {
  return tags.reduce<TagMap>((acc, { key, values }) => {
    if (!key) {
      return acc;
    }
    if (!acc[key]) {
      acc[key] = [];
    }
    values?.forEach((v: string) => acc[key].push(v));
    return acc;
  }, {});
}

interface TagDiff {
  key: string;
  added: string[];
  removed: string[];
}

function addFilter({ filter, groupBy }: SummarizeExpression, newFilter: TagFilter): SummarizeExpression {
  if (filter.type === 'EXPRESSION' && filter.elements.length === 0) {
    return {
      filter: newFilter,
      groupBy
    };
  }

  return {
    filter: {
      type: 'EXPRESSION',
      elements: [filter, newFilter],
      logicalOperator: 'AND'
    },
    groupBy
  };
}

function removeGroupBy({ filter, groupBy }: SummarizeExpression, groupByToRemove: string): SummarizeExpression {
  return {
    filter,
    groupBy: groupBy.filter(gb => gb !== groupByToRemove)
  };
}

function useLinkToState() {
  const pathname = '/internal/thisUnit/tagSets';
  const { createHref, location } = useNavigation();

  return useCallback(
    ({ query, source }: { query?: string; source?: string }) => {
      const clonedLocation = cloneLocation(location);
      clonedLocation.pathname = pathname;

      if (query) {
        setOrDeleteMatrixParameter(clonedLocation, queryParameter, query);
      }
      if (source) {
        setOrDeleteMatrixParameter(clonedLocation, sourceParameter, source);
      }

      return createHref(clonedLocation);
    },
    [createHref, location]
  );
}

function treeToExpression(tree: Tree, query: string): SummarizeExpression {
  const or = tree.topNode.getChild('OrExpression');
  const groupBy = tree.topNode.getChild('GroupByExpression');

  return {
    filter: or ? orToFilterExpression(or, query) : EMPTY_EXPRESSION,
    groupBy: groupBy ? groupByNodeToGroupBys(groupBy, query) : []
  };
}

function expressionToQuery(expression: SummarizeExpression): string {
  const filter = filterToQuery(expression.filter);
  const groupBy = groupByToQuery(expression.groupBy);
  if (filter && groupBy) {
    return filter + ' group by ' + groupBy;
  } else if (filter) {
    return filter;
  } else if (groupBy) {
    return groupBy;
  } else {
    return '';
  }
}

function filterToQuery(filter: TagFilterExpressionElementUnion): string {
  if (filter.type === 'EXPRESSION') {
    return '(' + filter.elements.map(element => filterToQuery(element)).join(' ' + filter.logicalOperator + ' ') + ')';
  } else {
    return tagFilterToQuery(filter);
  }
}

function tagFilterToQuery(filter: TagFilter): string {
  return `${filter.name} ${operatorToQuery(filter.operator)} "${filter.value}"`;
}

function operatorToQuery(operator: TagFilterOperator): string {
  if (operator === 'NOT_EQUAL') {
    return '!=';
  } else {
    return '=';
  }
}

function groupByToQuery(groupBy: string[]): string {
  return groupBy.join(', ');
}

function orToFilterExpression(orNode: SyntaxNode, query: string): TagFilterExpressionElementUnion {
  const ands = orNode.getChildren('AndExpression');
  return binaryToFilterExpression(ands, query, 'OR', andToFilterExpression);
}

function andToFilterExpression(andNode: SyntaxNode, query: string): TagFilterExpressionElementUnion {
  const terms = andNode.getChildren('Term');
  return binaryToFilterExpression(terms, query, 'AND', termToFilterExpression);
}

function binaryToFilterExpression(
  nodes: SyntaxNode[],
  query: string,
  operator: LogicalOperator,
  converter: (node: SyntaxNode, query: string) => TagFilterExpressionElementUnion
): TagFilterExpressionElementUnion {
  const expressions = nodes.map(expr => converter(expr, query));
  if (expressions.length === 0) {
    return EMPTY_EXPRESSION;
  } else if (expressions.length === 1) {
    return expressions[0];
  } else {
    return {
      type: 'EXPRESSION',
      logicalOperator: operator,
      elements: expressions
    };
  }
}

function termToFilterExpression(termNode: SyntaxNode, query: string): TagFilterExpressionElementUnion {
  const filter = termNode.getChild('Filter');
  const or = termNode.getChild('OrExpression');
  if (filter) {
    return filterToFilterExpression(filter, query);
  } else if (or) {
    return orToFilterExpression(or!, query);
  } else {
    throw new ParseError('Expected filter or parenthesized expression');
  }
}

function filterToFilterExpression(filter: SyntaxNode, query: string): TagFilter {
  const key = filter.getChild('TagKey');
  if (!key) {
    throw new ParseError('Expected tag key');
  }
  const operator = filter.getChild('FilterOperator');
  if (!operator) {
    throw new ParseError('Expected operator');
  }
  const value = filter.getChild('TagValue');
  if (!value) {
    throw new ParseError('Expected tag value');
  }
  return {
    type: 'TAG_FILTER',
    name: getText(key, query),
    operator: parseOperator(getText(operator, query)),
    value: tagValueToString(value, query),
    entity: 'NOT_APPLICABLE'
  };
}

function tagValueToString(filter: SyntaxNode, query: string): string {
  const string = filter.getChild('String');
  if (string) {
    return getText(string, query);
  }
  const quotedString = filter.getChild('QuotedString');
  if (!quotedString) {
    throw new ParseError('Expected tag value as string or quoted string');
  }
  return query.slice(quotedString.from + 1, quotedString.to - 1);
}

function groupByNodeToGroupBys(groupByNode: SyntaxNode, query: string): string[] {
  const tagKeys = groupByNode.getChildren('TagKey');

  return tagKeys.map(tagKey => getText(tagKey, query));
}

function getText(node: SyntaxNode, input: string): string {
  return input.slice(node.from, node.to);
}

interface SummarizeExpression {
  groupBy: string[];
  filter: TagFilterExpressionElementUnion;
}

function parseOperator(term: string) {
  if (term === '=') {
    return EQUALS;
  } else if (term === '!=') {
    return NOT_EQUAL;
  } else {
    throw new ParseError('Unexpected operator ' + term);
  }
}

const summarizeTagSets = memoize(summarizeTagSetsRaw, arg => JSON.stringify(arg));

function summarizeTagSetsRaw(data: SummarizeTagSetsQuery) {
  return http<SummarizeTagSetsResponse>({
    method: 'POST',
    headers: getCsrfHeader(),
    url: '/api/tag-processor/summarize-tag-sets',
    mapToResultObject: true,
    maxRetries: 3,
    data
  });
}

const getTagSets = memoize(getTagSetsRaw, arg => JSON.stringify(arg));

function getTagSetsRaw(data: GetTagSetsQuery) {
  return http<GetTagSetsResponse>({
    method: 'POST',
    headers: getCsrfHeader(),
    url: '/api/tag-processor/tag-sets',
    mapToResultObject: true,
    maxRetries: 3,
    data
  });
}

class ParseError extends Error {}
