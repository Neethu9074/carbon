/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { setFocused, isFocused$ } from 'in-components/SearchBar/stores/focus';
import { setSelectedSnapshotId } from 'in-stores/snapshot';
import { searchMatches$ } from 'in-stores/search/searchMatches';
import { createStore } from 'in-stores/store';

const highligtedSuggestionStore = createStore({
  name: 'in-components/SearchBar/stores/highligtedSuggestion',
  initialValue: -1
});

export const highligtedSuggestion$ = highligtedSuggestionStore.observable.distinct();

export function highlightNextSuggestion() {
  searchMatches$.once(matches => {
    highligtedSuggestionStore.applyStateMutation(highlightedMatch => {
      if (!matches) {
        return -1;
      }

      return Math.min(highlightedMatch + 1, matches.size - 1, 4);
    });
  });
}

export function highlightPreviousSuggestion() {
  searchMatches$.once(matches => {
    highligtedSuggestionStore.applyStateMutation(highlightedMatch => {
      if (!matches) {
        return -1;
      }

      return Math.max(highlightedMatch - 1, 0);
    });
  });
}

export function selectHighlightedSuggestion() {
  searchMatches$.once(matches => {
    if (!matches) {
      return;
    }

    highligtedSuggestion$.once(highligtedSuggestion => {
      highligtedSuggestion = highligtedSuggestion === -1 ? 0 : highligtedSuggestion;
      const match = matches.get(highligtedSuggestion);
      if (match) {
        setSelectedSnapshotId(match);
        setFocused(false);
      }
    });
  });
}

export function init() {
  isFocused$.distinct().subscribe(() => {
    highligtedSuggestionStore.applyStateMutation(() => -1);
  });

  searchMatches$.subscribe(matches => {
    highligtedSuggestionStore.applyStateMutation(highlightedMatch => {
      if (!matches || highlightedMatch === -1) {
        return -1;
      }

      return Math.max(Math.min(highlightedMatch, matches.size - 1, 4), 0);
    });
  });
}
