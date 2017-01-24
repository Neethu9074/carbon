import React from 'react';

import MenuHeading from 'in-components/SearchBar/components/MenuHeading';
import {fieldsCategorized} from 'in-stores/search/fields';

import './AvailableKeywords.less';

const block = 'in-search-available-keywords';

export default function AvailableKeywords() {
  return (
    <div className={block}>
      <MenuHeading>
        Available Search Keywords
      </MenuHeading>
    </div>
  );
}
