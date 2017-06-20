import React from 'react';

import { toggle, expanded$ } from 'in-stores/search/searchBarExpanded';
import { evaluateClassNames } from 'in-services/util/classnames';
import { filtered$ } from 'in-stores/search/filtered';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './SearchButton.less';

const block = 'in-search-button';

export default connectTo(
  {
    expanded: expanded$,
    filtered: filtered$
  },
  function SearchButton({ expanded, filtered }) {
    return (
      <Button
        className={evaluateClassNames({
          [block]: true,
          [`${block}--active`]: expanded,
          [`${block}--filtered`]: filtered
        })}
        kind="secondary"
        size="sm"
        onClick={toggle}
      >
        <SvgIcon type="search" height={13} className={`${block}__icon`} />
      </Button>
    );
  }
);
