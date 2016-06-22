/* global process:false */

import {inputString$} from 'in-components/SearchBar/stores/searchInputString';


export const queryParts$ = inputString$
  .debounce(process.env.IS_TEST ? 0 : 200)
  .distinct()
  .map(query => query.trim()
                     .split(' ')
                     .filter(p => p.length > 2)
                     .map(p => p.toLowerCase())
  );
