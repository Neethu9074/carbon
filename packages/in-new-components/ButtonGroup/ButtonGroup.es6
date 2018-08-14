import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ buttonPropsList, activeKey }) {
  return (
    <div className={locals.buttonGroup}>
      {buttonPropsList.map((props, i) => (
        <Button
          key={props.key}
          {...buttonPropsList}
          className={evaluateClassNames({
            [locals.button]: true,
            [locals.first]: i === 0,
            [locals.last]: i === buttonPropsList.length - 1,
            [locals.active]: activeKey === props.key
          })}
        >
          {props.text}
        </Button>
      ))}
    </div>
  );
}
