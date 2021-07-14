/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { escapeRegExp } from 'lodash';

import { useObservable } from '@instana/hooks';

import { pendingResult } from 'in-services/fixedObjects';
import { identity } from 'in-services/util/function';
import { mapDataHO } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function useSuggestions({
  tag,
  entity,
  facets,
  formModel,
  hiddenCalls,
  dataSource,
  getSuggestions,
  tagCatalog,
  valueFilter,
  customLabelMapper = identity,
  getItems = ({ items }) => items,
  getSuggestionName = ({ name }) => JSON.parse(name)
}) {
  const timeConfig = useTimeConfig();
  const tagDefinition = tagCatalog?.tags.find(tagEntry => tagEntry.name === tag);
  const isBooleanTag = tagDefinition?.type === 'BOOLEAN';

  const valueRegex = new RegExp(
    valueFilter
      .split('')
      .map(escapeRegExp)
      .join('.*'),
    'i'
  );

  return (
    useObservable(
      getSuggestions({ tag, entity }).map(
        mapDataHO(data => ({
          ...data,
          items: getItems(data)
            .map(suggestion => ({
              ...suggestion,
              name: getSuggestionName(suggestion)
            }))
            .filter(suggestion => valueRegex.test(customLabelMapper(suggestion.name)))
            .map(suggestion => ({
              ...suggestion,
              value: isBooleanTag ? suggestion.name === 'true' : suggestion.name
            }))
        }))
      ),
      [getSuggestions, facets, formModel, hiddenCalls, tag, valueFilter, dataSource, timeConfig]
    ) ?? pendingResult
  );
}
