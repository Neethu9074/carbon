import React from 'react';

import {getSnapshot, setSelectedSnapshotId} from 'in-stores/snapshot';
import {isFocused$, setFocused} from 'in-components/SearchBar/stores/focus';
import {searchMatches$, error$} from 'in-stores/search';
import {getLabel, getIcon} from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

import './Suggestions.less';

const block = 'in-search-suggestions';

const Suggestion = connectTo(props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  }, function Suggestion({snapshot}) {
    if (!snapshot) {
      return null;
    }

    const label = getLabel(snapshot);

    return (
      <div className={`${block}__suggestion`}
           onClick={() => {
             setSelectedSnapshotId(snapshot.get('id'));
             setFocused(false);
           }}>
        <img src={getIcon(snapshot)}
             alt={`Icon for entity: ${label}`}
             className={`${block}__icon`}/>

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
    isFocused: isFocused$
  }, function Suggestions({searchMatches, error, isFocused}) {
    if (searchMatches == null || error || !isFocused) {
      return null;
    } else if (searchMatches.size === 0) {
      return (
        <div className={block}>
          No matches
        </div>
      );
    }

    const remainingHitCount = searchMatches.size - 5;
    return (
      <div className={block}>
        {searchMatches.toArray().slice(0, 5).map(searchMatch =>
          <Suggestion key={searchMatch}
                      snapshotId={searchMatch} />
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
