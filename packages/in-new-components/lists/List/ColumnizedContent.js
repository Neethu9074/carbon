/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import rpt from 'prop-types';
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

export const columnDefinitionShape = {
  width: rpt.string,
  minWidth: rpt.string,
  getContent: rpt.func.isRequired,
  verticallyCenter: rpt.bool,
  forceMinimumWidth: rpt.bool,
  shrink: rpt.bool
};

ColumnizedContent.propTypes = {
  columnDefinitions: rpt.arrayOf(rpt.shape(columnDefinitionShape)).isRequired
};
