import React from 'react';

import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';

import locals from './DBmarlinNotification.mless';

export default function DBmarlinNotification({ children, className, bold, small }) {
  return (
    <div
      className={joinClassNames(
        evaluateClassNames({
          [locals.message]: true,
          [locals.small]: small,
          [locals.bold]: bold
        }),
        className
      )}
    >
      <div className={locals.firstLine}>
        <span
          className={evaluateClassNames({
            [locals.content]: true,
            [locals.smallSize]: small
          })}
        >
          {children}
        </span>
      </div>
    </div>
  );
}
