import React from 'react';

import {toggleKeywords, keywordsVisible$} from 'in-components/SearchBar/stores/keywordsVisibility';
import {togglePresets, presetsVisible$} from 'in-components/SearchBar/stores/presetsVisibility';
import AvailableKeywords from 'in-components/SearchBar/components/AvailableKeywords';
import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import FilterPresets from 'in-components/SearchBar/components/FilterPresets';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import {setFocused} from 'in-components/SearchBar/stores/focus';
import {evaluateClassNames} from 'in-services/util/classnames';
import {expanded$} from 'in-stores/search/searchBarExpanded';
import {unvalidatedQuery$} from 'in-stores/search/query';
import {setInputString} from 'in-stores/search/query';
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

export const idOfSearchField = 'search';

export default connectTo({
  unvalidatedQuery: unvalidatedQuery$,
  expanded: expanded$,
  presetsVisible: presetsVisible$,
  keywordsVisible: keywordsVisible$
},
function SearchBar({unvalidatedQuery, expanded, presetsVisible, keywordsVisible}) {
  if (!expanded) {
    return null;
  }

  return (
    <div>
      {presetsVisible ?
        <FilterPresets />
      : null}
      {keywordsVisible ?
        <AvailableKeywords />
      : null}

      <div className={block}>
        <div className={evaluateClassNames({
               [`${block}__expand-collapse-wrapper`]: true,
               [`${block}__expand-collapse-wrapper--menu-visible`]: keywordsVisible
             })}
             onClick={toggleKeywords} >
          <SvgIcon type='search'
                   height={12}
                   className={`${block}__icon`} />
        </div>

        <input type='search'
               value={unvalidatedQuery}
               className={`${block}__input`}
               placeholder='Search…'
               onChange={onChange}
               onKeyDown={onKeyDown}
               onFocus={onFocus}
               onBlur={onBlur}
               autoFocus
               id={idOfSearchField} />

        <div className={evaluateClassNames({
               [`${block}__expand-collapse-wrapper`]: true,
               [`${block}__expand-collapse-wrapper--menu-visible`]: presetsVisible
             })}
             onClick={togglePresets} >
          <SvgIcon type='menu'
                   height={10}
                   className={`${block}__icon`} />
        </div>

        <ErrorIndicator />
        <Suggestions />
      </div>
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
