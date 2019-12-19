import { string, array, func } from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Dropdown.mless';

export default function Dropdown({ icon, label, items, renderItemContent, onClick }) {
  return (
    <Overlay align="bottomMiddle" content={ItemList} props={{ items, renderItemContent, onClick }}>
      {({ toggle, isOpen }) => (
        <Button
          className={evaluateClassNames({
            [locals.button]: true
          })}
          kind="primaryv2"
          icon={icon}
          onClick={toggle}
        >
          {label}
          <SvgIcon className={locals.expandIcon} type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} />
        </Button>
      )}
    </Overlay>
  );
}

Dropdown.propTypes = {
  icon: string,
  label: string.isRequired,
  items: array.isRequired,
  onClick: func.isRequired,
  renderItemContent: func
};

export function ItemList({ renderItemContent, items, onClick }) {
  return (
    <Ul>
      {items.map((item, i) => (
        <Li key={i} onClick={() => onClick(item)}>
          {renderItemContent ? renderItemContent(item) : item.label}
        </Li>
      ))}
    </Ul>
  );
}
