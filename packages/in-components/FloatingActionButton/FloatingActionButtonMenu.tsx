/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState, ReactElement, Children } from 'react';
import ClickAwayListener from 'react-click-away-listener';
import classNames from 'classnames';

import { keyCodes, SvgIcon } from '@instana/components';
import { themes } from '@instana/design-tokens';

import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';

import locals from 'in-components/FloatingActionButton/FloatingActionButtonMenu.mless';

export default function FloatingActionButtonMenu({
  children,
  label = 'Add'
}: {
  children: React.ReactNode;
  label?: string;
}): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const childrenArray = Children.toArray(children) as ReactElement[];
  const filteredItems = children ? childrenArray.filter?.(Boolean) ?? [children] : [];
  const hasNoItems = filteredItems.length === 0;

  if (hasNoItems) return null;

  const toggleMenu = () => setMenuOpen(!menuOpen && !hasNoItems);
  const { isTab, isEscape } = keyCodes;

  // we need to control tabbing to ensure that tabbing on the last menu item
  // closes the menu and moved focus to the trigger button (same for Escape key)
  const keyDownHandler = (e: React.KeyboardEvent) => {
    if (!menuOpen || !containerRef.current || (!isTab(e) && !isEscape(e))) return;

    const handleExit = () => {
      e.preventDefault();
      setMenuOpen(false);
      buttonRef.current?.focus();
    };

    const allFocusableNodes = containerRef.current.querySelectorAll('button:not([disabled]), a[href]:not([disabled])');
    const lastFocusableNode = allFocusableNodes[allFocusableNodes.length - 1];

    if (isEscape(e) || document.activeElement === lastFocusableNode) handleExit();
  };

  return (
    <div className={locals.container} onKeyDown={keyDownHandler} ref={containerRef}>
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <FloatingActionButton
          onClick={toggleMenu}
          kind={menuOpen ? 'action' : 'primaryv2'}
          withBoxShadow
          ref={buttonRef}
        >
          <div className={locals.buttonLabelContainer}>
            <SvgIcon
              type={'lib_openclose_add'}
              className={menuOpen ? locals.rotate : ''}
              color={themes.default.ids.color.option.white}
            />
            <label className={menuOpen ? locals.labelHidden : ''}>{label}</label>
          </div>
        </FloatingActionButton>
      </ClickAwayListener>
      {menuOpen && (
        <ul
          className={classNames({
            [locals.menuOpen]: menuOpen,
            [locals.menuClosed]: !menuOpen,
            [locals.dropdown]: true
          })}
        >
          {filteredItems.map((item: ReactElement, idx: number) => (
            <li key={idx} className={locals.withShadow}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
