import React from 'react';

import {visible$} from 'in-components/SearchBar/stores/menuVisibility';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  visible: visible$
}, function SearchMenu({visible}) {
  if (!visible) {
    return null;
  }

  return (
    <div>
      Search Menu
    </div>
  );
});
