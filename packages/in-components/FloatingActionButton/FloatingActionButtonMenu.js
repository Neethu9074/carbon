/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import ClickAwayListener from 'react-click-away-listener';
import React, { useState } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import FloatingActionButton from 'in-components/FloatingActionButton/FloatingActionButton';
import { lib } from 'in-themes';

import locals from './FloatingActionButtonMenu.mless';

export default function FloatingActionButtonMenu({ children, label = 'Add' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const filteredItems = children ? children.filter?.(Boolean) ?? [children] : [];
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
        {filteredItems.map((item, idx) => (
          <li key={idx} className={locals.withShadow}>
            {item}
          </li>
        ))}
      </ul>
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <FloatingActionButton onClick={toggleMenu} kind={menuOpen ? 'action' : 'primaryv2'} withBoxShadow>
          <div className={locals.buttonLabelContainer}>
            <SvgIcon type={'lib_openclose_add'} className={menuOpen ? locals.rotate : ''} color={lib.colors.white} />
            <label className={menuOpen ? locals.labelHidden : ''}>{label}</label>
          </div>
        </FloatingActionButton>
      </ClickAwayListener>
    </div>
  );
}
