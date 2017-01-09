import React from 'react';

import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import {setFocused} from 'in-components/SearchBar/stores/focus';
import {rawQuery$, setInputString} from 'in-stores/search';
import {expanded$} from 'in-stores/search/expanded';
import keyCodes from 'in-components/keyCodes';
import {
  highlightNextSuggestion,
  highlightPreviousSuggestion,
  selectHighlightedSuggestion
} from 'in-components/SearchBar/stores/highlightedSuggestion';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo({
  rawQuery: rawQuery$,
  expanded: expanded$
}, function SearchBar({rawQuery, expanded}) {
  if (!expanded) {
    return null;
  }

  return (
    <div className={block}>
      <div className={`${block}__field-wrapper`}>
        <SvgIcon type='search'
                 height={12}
                 className={`${block}__icon`} />

        <input type='search'
               value={rawQuery}
               className={`${block}__input`}
               placeholder='Search…'
               onChange={onChange}
               onKeyDown={onKeyDown}
               onFocus={onFocus}
               onBlur={onBlur} />
      </div>

      <SvgIcon type='triangle_down'
               width={12}
               className={`${block}__expand-collapse`} />

      <ErrorIndicator />
      <Suggestions />
    </div>
  );
});

function onChange(e) {
  setInputString(e.target.value);
}

function onKeyDown(e) {
  setFocused(true);
  if (e.keyCode === keyCodes.enter) {
    e.preventDefault();
    selectHighlightedSuggestion();
  } else if (e.keyCode === keyCodes.arrows.top) {
    e.preventDefault();
    highlightPreviousSuggestion();
  } else if (e.keyCode === keyCodes.arrows.bottom) {
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
