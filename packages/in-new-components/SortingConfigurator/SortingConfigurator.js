/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@instana/components';
import { Ul } from '@instana/components';

import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';
import { t } from 'in-i18n';

import locals from './SortingConfigurator.mless';

export default function SortingConfigurator({ options, orderBy, onChange }) {
  const valueLabel =
    options.find(option => option.value === orderBy.by)?.label ?? t('in-new-components:sortingConfigurator.labelNA');
  const ref = useRef();

  return (
    <div className={locals.configurator}>
      <Overlay
        content={Options}
        props={{ options, onChange, orderBy }}
        onCloseSideEffect={() => ref.current?.focus()}
        wrapperClassName={locals.select}
      >
        {({ toggle, refSetter }) => (
          <DropdownButton
            className={locals.selectButton}
            kind="secondary"
            refSetter={compositeRef(refSetter, ref)}
            onClick={toggle}
          >
            {valueLabel}
          </DropdownButton>
        )}
      </Overlay>
      <Button
        icon={orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
        kind="secondary"
        className={locals.sorting}
        onClick={() =>
          onChange({
            by: orderBy.by,
            direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
          })
        }
      >
        {orderBy.direction === 'ASC'
          ? t('in-new-components:sortingConfigurator.buttonAscending')
          : t('in-new-components:sortingConfigurator.buttonDescending')}
      </Button>
    </div>
  );
}

export const optionsPropType = PropTypes.arrayOf(
  PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.node.isRequired }).isRequired
);
SortingConfigurator.propTypes = {
  onChange: PropTypes.func.isRequired,
  options: optionsPropType.isRequired,
  // see com.instana.ui.model.pagination.Order
  orderBy: PropTypes.shape({ by: PropTypes.string.isRequired, direction: PropTypes.oneOf(['ASC', 'DESC']).isRequired })
    .isRequired
};

function Options({ options, onChange, orderBy, close }) {
  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      {options.map((option, i) => (
        <OverlayOption
          onChange={onChange}
          key={option.value}
          autoFocus={(orderBy.by == null && i === 0) || orderBy.by === option.value}
          close={close}
          value={{ by: option.value, direction: orderBy.direction }}
          size="compact"
        >
          {option.label}
        </OverlayOption>
      ))}
    </Ul>
  );
}
