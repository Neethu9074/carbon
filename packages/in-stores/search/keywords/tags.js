/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Set } from 'immutable';

import { setField, removeField, getFieldTerms } from 'in-stores/search/manipulation';
import { query$, mutateQuery } from 'in-stores/search/query';

// A stream of the form ImmutableSet<String> describing the currently active
// tag filters.
export const filteredTags$ = query$.map(query => Set(getFieldTerms(query, 'entity.tag').map(t => t.toLowerCase())));

export function setTagFilter(tag) {
  mutateQuery(query => setField(query, 'entity.tag', tag));
}

export function removeTagFilter(tag) {
  mutateQuery(query => removeField(query, 'entity.tag', tag));
}
