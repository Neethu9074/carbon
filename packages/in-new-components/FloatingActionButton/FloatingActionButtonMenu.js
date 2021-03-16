/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import FloatingActionButton from 'in-new-components/FloatingActionButton/FloatingActionButton';
import SvgIcon from 'in-components/SvgIcon';
import { lib } from 'in-themes';

import locals from './FloatingActionButtonMenu.mless';

export default function FloatingActionButtonMenu({ children, label = 'Add' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const filteredItems = children ? children.filter?.(Boolean) ?? [children] : [];
  const hasNotItems = filteredItems.length === 0;
  const toggleMenu = () => setMenuOpen(!menuOpen && !hasNotItems);

  if (hasNotItems) {
    return null;
  }

  return (
    <div className={locals.container}>
      {menuOpen && (
        <ul>
          {filteredItems.map((item, idx) => (
            <li key={idx} className={locals.withShadow}>
              {item}
            </li>
          ))}
        </ul>
      )}
      <FloatingActionButton
        onClick={toggleMenu}
        kind={menuOpen ? 'action' : 'primaryv2'}
        onBlur={() => {
          setMenuOpen(false);
        }}
        withBoxShadow
      >
        <div className={locals.buttonLabelContainer}>
          <SvgIcon type={'lib_openclose_add'} className={menuOpen ? locals.rotate : ''} color={lib.colors.white} />
          <label className={menuOpen ? locals.labelHidden : ''}>{label}</label>
        </div>
      </FloatingActionButton>
    </div>
  );
}
