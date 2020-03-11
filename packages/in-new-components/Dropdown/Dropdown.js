import { string, array, func, bool } from 'prop-types';
import React from 'react';

import evaluateClassNames from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dropdown.mless';

export default function Dropdown({
  icon,
  align = 'bottomMiddle',
  label,
  items,
  renderItemContent,
  onClick,
  asSimpleDropdown,
  className
}) {
  return (
    <Overlay align={align} content={ItemList} props={{ items, renderItemContent, onClick }} withoutWrapper>
      {({ toggle, isOpen, refSetter }) => (
        <Button
          className={evaluateClassNames({
            [locals.simpleDropdown]: asSimpleDropdown,
            [className]: true
          })}
          kind={asSimpleDropdown ? 'subtle' : 'primaryv2'}
          icon={icon}
          onClick={toggle}
          refSetter={refSetter}
        >
          {label}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_drop_up' : 'lib_arrow_drop_down'} />
        </Button>
      )}
    </Overlay>
  );
}

Dropdown.propTypes = {
  icon: string,
  align: string,
  label: string.isRequired,
  items: array.isRequired,
  onClick: func.isRequired,
  renderItemContent: func,
  asSimpleDropdown: bool,
  className: string
};

export function ItemList({ renderItemContent, items, onClick, close }) {
  return (
    <Ul className={locals.list}>
      {items.map((item, i) => (
        <Li key={i} onClick={() => close() || onClick(item)}>
          {renderItemContent ? renderItemContent(item, i) : item.label}
        </Li>
      ))}
    </Ul>
  );
}
