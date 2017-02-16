import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {noExpandedSides$} from 'in-components/TwoColumnView/store';
import {headerHeight$} from 'in-stores/header/height';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TwoColumnView.less';

const block = 'in-two-column-view';

export default connectTo(props => {
  return {
    timelineHeight: timelineHeight$,
    headerHeight: headerHeight$,
    expandedSide: props.expandedSide$ || noExpandedSides$
  };
}, function TwoColumnView({timelineHeight, leftContent, rightContent, headerHeight, leftWidth = '40rem',
    expandedSide}) {
  return (
    <section className={block}
             style={{
               top: toPx(headerHeight),
               bottom: toPx(timelineHeight)
             }}>
      {expandedSide !== 'right' ?
        <div className={`${block}__left`}
             style={{
               maxWidth: expandedSide === 'left' ? undefined : leftWidth
             }}>
          {leftContent}
        </div>
      : null}

      {expandedSide !== 'left' ?
        <div className={`${block}__right`}
             style={{
               maxWidth: expandedSide === 'right' ? undefined : `calc(100% - ${leftWidth})`
             }}>
          {rightContent}
        </div>
      : null}
    </section>
  );
});
