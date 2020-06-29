import PropTypes from 'prop-types';
import React from 'react';

import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import Typeahead from 'in-analyze/components/EditTagFilterDialog/Typeahead';
import { evaluateClassNames } from 'in-services/util/classnames';
import { Ul } from 'in-new-components/lists/List/List';

import locals from './SimpleValueSelector.mless';

export default function SimpleValueSelector({ onChange, close, values }) {
  return (
    <Typeahead
      options={values}
      resultsToShow={42}
      value=""
      onChange={e => onChange(e.value)}
      close={close}
      InputRenderer={InputRenderer}
      ListRenderer={ListRenderer}
    />
  );
}

function InputRenderer({ getInputProps, openMenu }) {
  return <input {...getInputProps({ onFocus: openMenu })} />;
}

function ListRenderer({ close, getMenuProps, getItemProps, filteredOptions, highlightedIndex }) {
  const menuProps = getMenuProps();
  return (
    <Ul {...menuProps} refSetter={menuProps.ref}>
      {filteredOptions.map((item, index) => {
        const itemProps = getItemProps({
          index,
          item
        });

        return (
          <OverlayOption
            key={index}
            className={evaluateClassNames({
              [locals.highlighted]: highlightedIndex === index
            })}
            {...itemProps}
            onChange={itemProps.onClick}
            close={close}
            value={item}
          >
            {item}
          </OverlayOption>
        );
      })}
    </Ul>
  );
}

SimpleValueSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.array.isRequired,
  close: PropTypes.func.isRequired
};
