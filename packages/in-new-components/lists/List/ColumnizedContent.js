import classNames from 'classnames';
import React from 'react';

import locals from './ColumnizedContent.mless';

export default function ColumnizedContent(props) {
  const { columnDefinitions } = props;

  return (
    <>
      {columnDefinitions.map(
        (
          { width, minWidth = width, getContent, verticallyCenter = false, forceMinimumWidth = false, shrink = true },
          i
        ) => (
          <div
            key={i}
            style={{
              minWidth: minWidth,
              maxWidth: width,
              flexShrink: shrink ? 1 : 0
            }}
            className={classNames({
              [locals.verticallyCenter]: verticallyCenter,
              [locals.flexColumn]: !width,
              [locals.forceMinimumWidth]: forceMinimumWidth
            })}
          >
            {getContent(props)}
          </div>
        )
      )}
    </>
  );
}
