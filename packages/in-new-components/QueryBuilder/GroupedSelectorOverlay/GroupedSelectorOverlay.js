/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { Ul } from 'in-new-components/lists/List/List';

import locals from './GroupedSelectorOverlay.mless';

export default function GroupedSelectorOverlay({ value, onChange, close, items }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium">
      {items.map(item => (
        <OptionWithNestedValues key={item.value} item={item} onChange={onChange} close={close} selectedValue={value} />
      ))}
    </Ul>
  );
}

function OptionWithNestedValues({ onChange, close, item, selectedValue }) {
  const { label, value, items } = item;

  return (
    <OverlayOption
      className={locals.option}
      onChange={onChange}
      close={close}
      selectedValue={selectedValue}
      value={value}
      subList={
        items && items.length > 0 ? (
          <Ul>
            {items.map(_item => (
              <OptionWithNestedValues
                key={_item.value}
                onChange={onChange}
                close={close}
                selectedValue={selectedValue}
                item={_item}
              />
            ))}
          </Ul>
        ) : (
          undefined
        )
      }
    >
      {label}
    </OverlayOption>
  );
}

GroupedSelectorOverlay.propTypes = {
  value: PropTypes.string,
  close: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
