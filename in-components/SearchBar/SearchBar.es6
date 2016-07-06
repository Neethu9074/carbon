import React from 'react';

import ErrorIndicator from 'in-components/SearchBar/components/ErrorIndicator';
import Suggestions from 'in-components/SearchBar/components/Suggestions';
import {setFocused} from 'in-components/SearchBar/stores/focus';
import {rawQuery$, setInputString} from 'in-stores/search';
import {isPhysicalViewVisible$} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './SearchBar.less';


const block = 'in-searchbar';

export default connectTo({
    rawQuery: rawQuery$,
    isPhysicalViewVisible: isPhysicalViewVisible$
  }, function SearchBar({rawQuery, className, isPhysicalViewVisible}) {
    if (!isPhysicalViewVisible) {
      return null;
    }

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
               onChange={e => setInputString(e.target.value)}
               className={block + '__input'}
               placeholder='Search…'
               onClick={e => e.stopPropagation()}
               onFocus={() => setFocused(true)}
               onBlur={() => setTimeout(() => setFocused(false), 200)}/>

        <ErrorIndicator />
        <Suggestions />
      </div>
    );
  }
);
