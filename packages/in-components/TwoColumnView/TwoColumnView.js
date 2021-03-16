/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { noExpandedSides$ } from 'in-components/TwoColumnView/store';
import connectTo from 'in-hoc/connectTo';

import './TwoColumnView.less';

const block = 'in-two-column-view';

export default connectTo(
  props => {
    return {
      expandedSide: props.expandedSide$ || noExpandedSides$
    };
  },
  function TwoColumnView({ leftContent, rightContent, leftWidth = '40rem', expandedSide }) {
    return (
      <div className={block}>
        {expandedSide !== 'right' ? (
          <div
            className={`${block}__left`}
            style={{
              maxWidth: expandedSide === 'left' ? undefined : leftWidth
            }}
          >
            {leftContent}
          </div>
        ) : null}

        {expandedSide !== 'left' ? (
          <div
            className={`${block}__right`}
            style={{
              maxWidth: expandedSide === 'right' ? undefined : `calc(100% - ${leftWidth})`
            }}
          >
            {rightContent}
          </div>
        ) : null}
      </div>
    );
  }
);
