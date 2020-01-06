import { string, array, func } from 'prop-types';
import React from 'react';

import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dropdown.mless';

export default function Dropdown({ icon, align = 'bottomMiddle', label, items, renderItemContent, onClick }) {
  return (
    <Overlay align={align} content={ItemList} props={{ items, renderItemContent, onClick }}>
      {({ toggle, isOpen }) => (
        <Button kind="primaryv2" icon={icon} onClick={toggle}>
          {label}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} />
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
  renderItemContent: func
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
