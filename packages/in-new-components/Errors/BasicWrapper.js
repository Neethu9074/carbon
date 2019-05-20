import React, { Fragment } from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import locals from './BasicWrapper.mless';

export default function BasicWrapper({ width, height, text, renderIcon, className }) {
  let size = 'default';
  let iconSize = 48;
  if (height < 80) {
    size = 'small';
    iconSize = 24;
  }

  return (
    <div
      style={{
        width,
        height
      }}
      className={joinClassNames(locals.wrapper, className)}
    >
      {size === 'small' && renderIcon(iconSize)}
      {size === 'default' && (
        <Fragment>
          {renderIcon(iconSize)}
          <span className={locals.text}>{text}</span>
        </Fragment>
      )}
    </div>
  );
}
