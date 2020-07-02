import PropTypes from 'prop-types';
import React from 'react';

import {
  equals,
  notEqual,
  contains,
  notContains,
  labels
} from 'in-new-components/QueryBuilder/OperatorSelectorOverlay/supportedSelections';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { Ul } from 'in-new-components/lists/List/List';

import locals from './OperatorSelectorOverlay.mless';

export default function OperatorSelectorOverlay({ value, onChange, close }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium">
      <OverlayOption
        className={locals.option}
        autoFocus={value === equals}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={equals}
      >
        {labels[equals]}
      </OverlayOption>
      <OverlayOption className={locals.option} onChange={onChange} close={close} selectedValue={value} value={notEqual}>
        {labels[notEqual]}
      </OverlayOption>
      <OverlayOption className={locals.option} onChange={onChange} close={close} selectedValue={value} value={contains}>
        {labels[contains]}
      </OverlayOption>
      <OverlayOption
        className={locals.option}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={notContains}
      >
        {labels[notContains]}
      </OverlayOption>
    </Ul>
  );
}

OperatorSelectorOverlay.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
