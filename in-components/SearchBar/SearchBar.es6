import React from 'react';

import {inputString$, setInputString} from 'in-components/SearchBar/stores/searchInputString';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './SearchBar.less';

const block = 'in-searchbar';

export default connectTo({
    inputString: inputString$
  }, function SearchBar({inputString, className}) {
    let classes = block;
    if (className) {
      classes = `${classes} ${className}`;
    }

    return (
      <div className={classes}>
        <Icon type='search'
              className={block + '__search-icon'}/>

        <input type='search'
               value={inputString}
               onChange={e => setInputString(e.target.value)}
               className={block + '__input'}
               placeholder='Search…'
               onClick={e => e.stopPropagation()}/>
      </div>
    );
  }
);
