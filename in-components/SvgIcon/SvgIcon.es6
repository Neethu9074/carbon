/* eslint-disable no-console */
import React from 'react';

import icons from 'in-components/SvgIcon/registry.json';

import './SvgIcon.less';

const block = 'in-svg-icon';

export default function SvgIcon({ type, width, height, className, color, onClick, style, spinning }) {
  const icon = icons[type];
  if (!icon) {
    if (__DEV__) {
      console.error(`SVG icon ${type} is unknown.`);
    }
    return null;
  }

  let iconWidth;
  if (width) {
    iconWidth = width;
  } else if (height) {
    iconWidth = height * icon.ratio;
  } else {
    iconWidth = 1;
  }

  const iconHeight = height ? height : iconWidth / icon.ratio;
  style = style || {};
  style.width = `${iconWidth}px`;
  style.height = `${iconHeight}px`;

  let classNames = block;
  if (className) {
    classNames += ` ${className}`;
  }

  if (spinning) {
    classNames += ` ${block}--spinning`;
  }

  return (
    <svg
      className={classNames}
      width={width}
      height={height}
      style={style}
      viewBox={'0 0 ' + icon.width + ' ' + icon.height}
      fill={color}
      onClick={onClick}
    >
      {/* Ensure that the whole width/height is clickable in Safari */}
      <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0)" />
      <path d={icon.path} />
    </svg>
  );
}

export function SvgIconList({ className }) {
  const iconNames = Object.keys(icons).sort();
  return (
    <div className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {iconNames.map(key =>
        <div key={key} style={{ listStyle: 'none', margin: '0 2rem 1rem 0' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <SvgIcon type={key} width={16} height={16} color="#fff" spinning={key === 'spinner'} />
            <span style={{ marginLeft: '5px' }}>
              {key}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
