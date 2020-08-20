import React from 'react';
import PropTypes from 'prop-types';

import ConjunctionsAndBrackets from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';

export default function ConjunctionTagSelectorOverlay({ tagCatalog, onChange, close }) {
  return (
    <>
      <ConjunctionsAndBrackets
        onChange={v => {
          onChange(v);
          close();
        }}
      />

      <TagSelectorOverlay
        onChange={({ name }) => {
          onChange({
            type: 'TAG_FILTER',
            name,
            operator: 'EQUALS'
          });
        }}
        close={close}
        tagCatalog={tagCatalog}
      />
    </>
  );
}

ConjunctionTagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
