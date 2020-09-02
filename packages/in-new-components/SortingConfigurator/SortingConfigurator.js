import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul } from 'in-new-components/lists/List/List';
import { compositeRef } from 'in-services/util/react';

export default function SortingConfigurator({ options, value, onChange }) {
  const valueLabel = options.find(option => option.value === value)?.label ?? 'N/A';
  const ref = useRef();

  return (
    <Overlay
      content={Options}
      props={{ options, onChange, value }}
      withoutWrapper
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <DropdownButton
          kind="secondary"
          icon="lib_actions_sort"
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        >
          Sort by: {valueLabel}
        </DropdownButton>
      )}
    </Overlay>
  );
}

SortingConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.node.isRequired }).isRequired
  ).isRequired,
  value: PropTypes.string.isRequired
};

function Options({ options, onChange, value, close }) {
  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {options.map((option, i) => (
        <OverlayOption
          onChange={onChange}
          key={option.value}
          autoFocus={(value == null && i === 0) || value === option.value}
          close={close}
          value={option.value}
          size="compact"
        >
          {option.label}
        </OverlayOption>
      ))}
    </Ul>
  );
}
