import React, { useState } from 'react';
import PropTypes from 'prop-types';

import PreviousUsedFilter from 'in-new-components/QueryBuilder/TagSelectorOverlay/PreviousUsedFilter';
import SearchInput from 'in-new-components/QueryBuilder/TagSelectorOverlay/SearchInput';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { Ul, ListGroup } from 'in-new-components/lists/List/List';

import locals from './TagSelectorOverlay.mless';

export default function TagSelectorOverlay({ onChange, close }) {
  const [query, setQuery] = useState('');

  return (
    <>
      <Ul className={locals.filterList} framed={false} borderRadius="medium">
        <PreviousUsedFilter filter="foo AND bar" onClick={() => {}} />
        <SearchInput query={query} setQuery={setQuery} />
      </Ul>

      <ListGroup label="Recently Used">
        <OverlayOption className={locals.option} onChange={onChange} close={close} value="foobar">
          foobar
        </OverlayOption>
      </ListGroup>
    </>
  );
}

TagSelectorOverlay.propTypes = {
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
