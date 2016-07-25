/* eslint-disable max-len */
import React from 'react';


const ICONS = {
  arrow_up: {
    viewBox: '0 0 128 91.6',
    path: 'M124.4,21.7l-51.2,65c-5.9,5.9-15.7,5.9-19.7,0l-51.2-65C-3.5,13.8,2.4,0,12.2,0h102.4C126.4,0,132.3,11.8,124.4,21.7L124.4,21.7z'
  },
  arrow_down: {
    viewBox: '0 0 128 91.6',
    path: 'M3.6,69.9l51.2-65C60.7-1,70.5-1,74.5,4.9l51.2,65c5.8,7.9-0.1,21.7-9.9,21.7H13.4C1.6,91.6-4.3,79.8,3.6,69.9L3.6,69.9z'
  }
};

export default function SvgIcon({
  type,
  width,
  height,
  className,
  color
}) {
  width = width ? width : 1;
  height = height ? height : width;
  const icon = ICONS[type];
  if (!icon) {
    return null;
  }

  return (
    <svg className={className + ' ' + 'in-svg-icon'}
         width={width} height={height}
         style={{
           width: width + 'rem',
           height: height + 'rem',
           transformOrigin: '0'
         }}
         viewBox={icon.viewBox}>
     <path fill={color} d={icon.path} />
    </svg>
  );
}
