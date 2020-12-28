import React, { Fragment } from 'react';
import classNames from 'classnames';

import locals from './BasicWrapper.mless';

export default function BasicWrapper({ width, height, title, text, renderIcon, className }) {
  let size = 'default';
  let iconSize = 'xl';
  if (height < 80) {
    size = 'small';
    iconSize = 'regular';
  }

  return (
    <div
      style={{
        width,
        height
      }}
      className={classNames(locals.wrapper, className)}
    >
      {size === 'small' && renderIcon(iconSize)}
      {size === 'default' && (
        <Fragment>
          {renderIcon(iconSize)}
          {title && <h1 className={locals.title}>{title}</h1>}
          <span className={locals.text}>{text}</span>
        </Fragment>
      )}
    </div>
  );
}
