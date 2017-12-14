import React from 'react';

import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './ViewHeader.less';

const block = 'in-two-columns-view-view-header';

export default connectTo(
  props => ({
    expandedSide: props.expandedSide$
  }),
  function ViewHeader({ expandedSide, toggleRight, leftContent, leftWidth, onClear }) {
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
            <div className={block}>
              <SvgIcon type="x" onClick={onClear} height={8} className={`${block}__toggle-left`} />
              <SvgIcon
                type={expandedSide === 'right' ? 'minimize' : 'maximize'}
                onClick={toggleRight}
                height={14}
                className={`${block}__toggle-right`}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);
