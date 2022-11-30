/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren, useContext } from 'react';
import { isUndefined } from 'lodash';
import classNames from 'classnames';

import { Li } from '@instana/components';

import CheckboxFancy from 'in-components/form/CheckboxFancy/CheckboxFancy';
import { TabSelectContext } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

export interface TabSelectBaseItemProps<VALUE_TYPE> {
  /**
   * This should be equal to the ID of one of the TabSelectPanels to activate that particular panel.
   */
  forId: string;
  /**
   * An optional value returned by the onChange event of the TabSelect component when an TabSelectItem is selected.
   */
  value?: VALUE_TYPE;
}

export interface TabSelectItemProps<VALUE_TYPE> extends TabSelectBaseItemProps<VALUE_TYPE> {
  /**
   * If the component's children do not contain any descriptive text, an ariaLabel should be set.
   */
  ariaLabel?: string;
  /**
   * Disables all interaction.
   */
  disabled?: boolean;
  /**
   * Will render a radio button next to the text.
   */
  withRadioButton?: boolean;
}

export function TabSelectItem<VALUE_TYPE>({
  forId,
  children,
  value,
  ariaLabel,
  withRadioButton,
  disabled
}: PropsWithChildren<TabSelectItemProps<VALUE_TYPE>>) {
  const { activePanelId, setActivePanelId } = useContext(TabSelectContext);

  const isActive = activePanelId === forId;
  const onClickHandler = () => !disabled && !isUndefined(forId) && setActivePanelId(forId, value);

  return (
    <Li
      role="menuitem"
      ariaLabel={ariaLabel}
      onClick={!withRadioButton ? onClickHandler : undefined}
      className={classNames(locals.item, {
        [locals.itemActive]: isActive,
        [locals.itemDisabled]: disabled
      })}
    >
      <div className={classNames(locals.itemBody, { [locals.itemDisabled]: disabled })}>
        {withRadioButton ? (
          <CheckboxFancy
            label={children}
            checked={isActive}
            onChange={onClickHandler}
            disabled={disabled}
            asRadioButton
          />
        ) : (
          children
        )}
      </div>
    </Li>
  );
}
