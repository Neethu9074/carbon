/* eslint-disable max-len */
import React from 'react';


const ICONS = {
  arrow_up: {
    width: 128,
    height: 91.6,
    path: 'M124.4,21.7l-51.2,65c-5.9,5.9-15.7,5.9-19.7,0l-51.2-65C-3.5,13.8,2.4,0,12.2,0h102.4C126.4,0,132.3,11.8,124.4,21.7L124.4,21.7z'
  },
  arrow_down: {
    width: 128,
    height: 91.6,
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
  const icon = ICONS[type];
  if (!icon) {
    return null;
  }
  let iconWidth;
  if (width) {
    iconWidth = width;
  } else if (height) {
    iconWidth = height * (icon.width / icon.height);
  } else {
    iconWidth = 1;
  }

  const iconHeight = height ? height : iconWidth * (icon.height / icon.width);

  return (
    <svg className={className + ' ' + 'in-svg-icon'}
         width={width} height={height}
         style={{
           width: iconWidth + 'rem',
           height: iconHeight + 'rem',
           transformOrigin: '0'
         }}
         viewBox={'0 0 ' + icon.width + ' ' + icon.height}>
     <path fill={color} d={icon.path} />
    </svg>
  );
}

export function SvgIconList() {
  const icons = Object.keys(ICONS);
  return (
    <ul>
      {icons.map(key =>
        <li key={key}
            style={{listStyle: 'none'}}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <SvgIcon type={key}
                     width={1}
                     color='#fff' />
            <span style={{marginLeft: '10px'}}>
              {key}
            </span>
          </div>
        </li>
      )}
    </ul>
  );
}
