import React from 'react';

import {highligtedSuggestion$} from 'in-components/SearchBar/stores/highlightedSuggestion';
import {isFocused$, setFocused} from 'in-components/SearchBar/stores/focus';
import {getSnapshot, setSelectedSnapshotId} from 'in-stores/snapshot';
import {searchMatches$, error$} from 'in-stores/search';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Suggestions.less';

const block = 'in-search-suggestions';

const maxProposals = 10;

const Suggestion = connectTo(props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  }, function Suggestion({snapshot, isHighlighted}) {
    if (!snapshot) {
      return null;
    }

    const label = getLabel(snapshot);

    let classes = `${block}__suggestion`;
    if (isHighlighted) {
      classes = `${classes} ${block}__suggestion--highlighted`;
    }

    return (
      <div className={classes}
           onClick={() => {
             setSelectedSnapshotId(snapshot.get('id'));
             setFocused(false);
           }}>
        <img src={getIcon(snapshot)}
             alt={`Icon for entity: ${label}`}
             className={`${block}__icon`} />

        <span className={`${block}__label`}>
          {label}
        </span>
      </div>
    );
  }
);

export default connectTo({
    searchMatches: searchMatches$,
    error: error$,
    isFocused: isFocused$,
    highligtedSuggestion: highligtedSuggestion$
  }, function Suggestions({searchMatches, error, isFocused, highligtedSuggestion}) {
    if (searchMatches == null || error || !isFocused) {
      return null;
    } else if (searchMatches.size === 0) {
      return (
        <div className={block}>
          No matches
        </div>
      );
    }

    const remainingHitCount = searchMatches.size - maxProposals;
    return (
      <div className={block}>
        {searchMatches.toArray().slice(0, maxProposals).map((searchMatch, i) =>
          <Suggestion key={searchMatch}
                      snapshotId={searchMatch}
                      isHighlighted={highligtedSuggestion === i} />
        )}

        {remainingHitCount > 0 ?
          <div className={`${block}__hit-count`}>
            {remainingHitCount} more
          </div>
        : null}
      </div>
    );
  }
);
