import classNames from 'classnames';
import React from 'react';

import Button from 'in-new-components/Button';

import locals from './ButtonGroup.mless';

export default function ButtonGroup(props) {
  const { buttonPropsList, activeKey, segmented } = props;

  return (
    <div
      className={classNames({
        [locals.buttonGroup]: true,
        [props.className]: props.className
      })}
    >
      {buttonPropsList.map((buttonProps, i) => (
        <Button
          key={buttonProps.key}
          {...props}
          {...buttonProps}
          className={classNames({
            [locals.button]: true,
            [locals.segmented]: segmented,
            [locals.first]: i === 0,
            [locals.last]: i === buttonPropsList.length - 1,
            [locals.active]: activeKey === buttonProps.key,
            [buttonProps.className]: buttonProps.className
          })}
        >
          {buttonProps.text}
        </Button>
      ))}
    </div>
  );
}
