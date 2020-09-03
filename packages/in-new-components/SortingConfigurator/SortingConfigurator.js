import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul } from 'in-new-components/lists/List/List';
import { compositeRef } from 'in-services/util/react';

export default function SortingConfigurator({ options, order, onChange }) {
  const valueLabel = options.find(option => option.value === order.by)?.label ?? 'N/A';
  const ref = useRef();

  return (
    <Overlay
      content={Options}
      props={{ options, onChange, order }}
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
  // see com.instana.ui.model.pagination.Order
  order: PropTypes.shape({ by: PropTypes.string.isRequired, direction: PropTypes.oneOf(['ASC', 'DESC']).isRequired })
    .isRequired
};

function Options({ options, onChange, order, close }) {
  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {options.map((option, i) => (
        <OverlayOption
          onChange={onChange}
          key={option.value}
          autoFocus={(order.by == null && i === 0) || order.by === option.value}
          close={close}
          value={{ by: option.value, direction: order.direction }}
          size="compact"
        >
          {option.label}
        </OverlayOption>
      ))}
      <OverlayOption onChange={onChange} close={close} value={{ by: order.by, direction: 'ASC' }} size="compact">
        ASC
      </OverlayOption>

      <OverlayOption onChange={onChange} close={close} value={{ by: order.by, direction: 'DESC' }} size="compact">
        DESC
      </OverlayOption>
    </Ul>
  );
}
