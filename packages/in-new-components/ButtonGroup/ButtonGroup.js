import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button';

import locals from './ButtonGroup.mless';

export default function ButtonGroup(props) {
  const { buttonPropsList, activeKey } = props;

  return (
    <div className={locals.buttonGroup}>
      {buttonPropsList.map((buttonProps, i) => (
        <Button
          key={buttonProps.key}
          className={evaluateClassNames({
            [locals.button]: true,
            [locals.first]: i === 0,
            [locals.last]: i === buttonPropsList.length - 1,
            [locals.active]: activeKey === buttonProps.key
          })}
          {...props}
          {...buttonProps}
        >
          {buttonProps.text}
        </Button>
      ))}
    </div>
  );
}
