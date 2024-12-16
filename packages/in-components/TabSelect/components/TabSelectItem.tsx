/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { PropsWithChildren } from 'react';
import { isUndefined } from 'lodash';
import classNames from 'classnames';

import { Li, RadioButton } from '@instana/components';

import { PanelIdBase, useTabSelectContext } from 'in-components/TabSelect/context';

import locals from './TabSelect.mless';

export interface TabSelectBaseItemProps<PanelId extends PanelIdBase> {
  /**
   * This should be equal to the ID of one of the TabSelectPanels to activate that particular panel.
   */
  forId: PanelId;
}

export interface TabSelectItemProps<PanelId extends PanelIdBase> extends TabSelectBaseItemProps<PanelId> {
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

export function TabSelectItem<PanelId extends PanelIdBase>({
  ariaLabel,
  children,
  disabled,
  forId,
  withRadioButton
}: PropsWithChildren<TabSelectItemProps<PanelId>>) {
  const { activePanelId, onChange } = useTabSelectContext<PanelId>();

  const isActive = activePanelId === forId;

  const onClickHandler = () => !disabled && !isUndefined(forId) && onChange(forId);

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
          <RadioButton label={children} checked={isActive} onChange={onClickHandler} disabled={disabled} />
        ) : (
          children
        )}
      </div>
    </Li>
  );
}
