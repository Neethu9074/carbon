/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import Overlay from 'in-new-components/overlays/Overlay';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';

import locals from './FilterOperator.mless';

export default function FilterOperator({ selectedOperator, operators, onOperatorChanged }) {
  if (operators.length === 1) {
    return (
      <Pill className={locals.operatorSingle} color={theme.lib.colors.N400}>
        {operators[0]}
      </Pill>
    );
  }

  return (
    <Overlay align="bottomMiddle" content={Operators} props={{ operators, selectedOperator, onOperatorChanged }}>
      {({ toggle, isOpen }) => (
        <div className={locals.wrapper} onClick={toggle}>
          <Pill className={locals.operator} color={theme.lib.colors.N400}>
            {selectedOperator}
            <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} />
          </Pill>
        </div>
      )}
    </Overlay>
  );
}

function Operators({ selectedOperator, operators, onOperatorChanged, close }) {
  return (
    <ul className={locals.operatorList}>
      {operators
        .filter(operator => selectedOperator !== operator)
        .map(operator => (
          <li
            key={operator}
            className={locals.operatorListItem}
            onClick={() => {
              onOperatorChanged(operator);
              close();
            }}
          >
            {operator}
          </li>
        ))}
    </ul>
  );
}
