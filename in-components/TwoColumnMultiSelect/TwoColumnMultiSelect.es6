import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './TwoColumnMultiSelect.less';

const block = 'in-two-column-multi-select';

export default function TwoColumnMultiSelect({
  selectableItems,
  selectedItems,
  onSelectableClick,
  onSelectedClick,
  Item
}) {
  return (
    <div className={block}>
      <ItemBox title="Selectable items" items={selectableItems} onClick={onSelectableClick} Item={Item} />
      <div className={`${block}__icon-wrapper`}>
        <SvgIcon type="triangle_right" color="#40535b" height={16} width={16} />
      </div>
      <ItemBox title="Selected items" items={selectedItems} onClick={onSelectedClick} Item={Item} />
    </div>
  );
}

function ItemBox({ title, items = [], onClick, Item }) {
  return (
    <div className={`${block}__item-box`}>
      <div className={`${block}__header`}>{title}</div>
      <ul className={`${block}__list`}>
        {items.map((item, i) => (
          <li key={i} className={`${block}__item`} onClick={() => onClick(item)}>
            <Item item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
