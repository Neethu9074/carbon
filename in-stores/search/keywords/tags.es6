import {Set} from 'immutable';

import {setField, removeField, containsField, getFieldTerms} from 'in-stores/search/manipulation';
import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {query$, mutateQuery} from 'in-stores/search/query';
import {focusedMoment$} from 'in-stores/timeline';

// A stream of the form ImmutableSet<String> describing the currently active
// tag filters.
export const filteredTags$ = query$.map(query => Set(getFieldTerms(query, 'entity.tag').map(t => t.toLowerCase())));
export const filterableTags$ = focusedMoment$.flatMap(createFilterableTagsObservable);

export function setTagFilter(tag) {
  mutateQuery(query => setField(query, 'entity.tag', tag));
}

export function removeTagFilter(tag) {
  mutateQuery(query => removeField(query, 'entity.tag', tag));
}

export function removeAllTagFilters() {
  mutateQuery(query => removeField(query, 'entity.tag'));
}

export function containsTagFilter(query, tag) {
  return containsField(query, 'entity.tag', tag);
}
