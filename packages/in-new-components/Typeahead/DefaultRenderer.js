import classNames from 'classnames';
import React from 'react';

import { escapeSpecialChars } from 'in-services/util/regex';

import locals from './DefaultRenderer.mless';

export default function DefaultRenderer({
  getItemProps,
  getMenuProps,
  filteredOptions,
  highlightedIndex,
  selectedItem,
  inputValue
}) {
  const menuProps = getMenuProps();

  return (
    <ul
      className={locals.list}
      aria-labelledby={menuProps['aria-labelledby']}
      id={menuProps.id}
      role={menuProps.role}
      ref={menuProps.ref}
    >
      {filteredOptions.map((item, index) => (
        <li
          className={locals.listItem}
          {...getItemProps({
            key: `${item}${index}`,
            index,
            item,
            style: {
              backgroundColor: highlightedIndex === index ? '#edf5ff' : 'white',
              fontWeight: selectedItem === item ? 'bold' : 'normal'
            }
          })}
        >
          {getHighlightedText(item, inputValue)}
        </li>
      ))}
    </ul>
  );
}

function getHighlightedText(text, highlight) {
  if (!highlight) {
    return text;
  }
  const parts = text.split(new RegExp(`(${escapeSpecialChars(highlight)})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          className={classNames({
            [locals.higlightedText]: part.toLowerCase() === highlight.toString().toLowerCase()
          })}
        >
          {part}
        </span>
      ))}
    </span>
  );
}
