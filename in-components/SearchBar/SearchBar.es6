import React from 'react';

import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import {setFocused} from 'in-components/SearchBar/stores/focus';
import {rawQuery$, setInputString} from 'in-stores/search';
import keyCodes from 'in-components/keyCodes';
import {
  highlightNextSuggestion,
  highlightPreviousSuggestion,
  selectHighlightedSuggestion
} from 'in-components/SearchBar/stores/highlightedSuggestion';
import HelpLink from 'in-components/HelpLink';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo({
    rawQuery: rawQuery$
  }, function SearchBar({rawQuery, className}) {
    let classes = block;
    if (className) {
      classes = `${classes} ${className}`;
    }

    return (
      <div className={classes}>
        <Icon type='search'
              className={block + '__search-icon'}/>

        <input type='search'
               value={rawQuery}
               className={block + '__input'}
               placeholder='Search…'
               onChange={onChange}
               onKeyDown={onKeyDown}
               onFocus={onFocus}
               onBlur={onBlur}/>

        <HelpLink helpId='usingTheSearchBar'
                  className={`${block}__help`}>
          ?
        </HelpLink>

        <ErrorIndicator />
        <Suggestions />
      </div>
    );
  }
);

function onChange(e) {
  setInputString(e.target.value);
}

function onKeyDown(e) {
  setFocused(true);
  if (e.keyCode === keyCodes.enter) {
    e.preventDefault();
    selectHighlightedSuggestion();
  } else if (e.keyCode === keyCodes.arrow.top) {
    e.preventDefault();
    highlightPreviousSuggestion();
  } else if (e.keyCode === keyCodes.arrow.bottom) {
    e.preventDefault();
    highlightNextSuggestion();
  }
}

function onFocus() {
  setFocused(true);
}

function onBlur() {
  // allow for clicks on suggestions to be recognized. Otherwise the element would be disposed
  // before handling the click.
  setTimeout(() => setFocused(false), 200);
}
