/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';
import classNames from 'classnames';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';

import locals from 'in-components/FloatingActionButton/FloatingActionButtonMenu.mless';

export default function FloatingActionButtonMenu({
  children,
  label = 'Add'
}: {
  children: React.ReactNode;
  label?: string;
}): JSX.Element | null {
  const [menuOpen, setMenuOpen] = useState(false);
  const filteredItems = children ? React.Children.toArray(children).filter?.(Boolean) ?? [children] : [];
  const hasNoItems = filteredItems.length === 0;
  const toggleMenu = () => setMenuOpen(!menuOpen && !hasNoItems);

  if (hasNoItems) {
    return null;
  }

  return (
    <div className={locals.container}>
      <ul
        className={classNames({
          [locals.menuOpen]: menuOpen,
          [locals.menuClosed]: !menuOpen,
          [locals.dropdown]: true
        })}
      >
        {filteredItems.map((item: any, idx: number) => (
          <li key={idx} className={locals.withShadow}>
            {item}
          </li>
        ))}
      </ul>
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <FloatingActionButton onClick={toggleMenu} kind={menuOpen ? 'action' : 'primaryv2'} withBoxShadow>
          {
            (
              <div className={locals.buttonLabelContainer}>
                <SvgIcon
                  type={'lib_openclose_add'}
                  className={menuOpen ? locals.rotate : ''}
                  color={themes.default.ids.color.option.white}
                />
                <label className={menuOpen ? locals.labelHidden : ''}>{label}</label>
              </div>
            ) as unknown as Element
          }
        </FloatingActionButton>
      </ClickAwayListener>
    </div>
  );
}
