import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './TwoColumnMultiSelect.less';

const block = 'in-two-column-multi-select';

export default function TwoColumnMultiSelect({
  selectableItems,
  selectedItems,
  onSelectableClick,
  onSelectedClick,
  Item,
  fieldName
}) {
  return (
    <div className={block}>
      <div className={`${block}__item-box`}>
        <div className={`${block}__header`}>Selectable items</div>
        <ul className={`${block}__list`}>
          {selectableItems.map((item, i) => (
            <li key={i} className={`${block}__item`} onClick={() => onSelectableClick(item)}>
              <Item item={item} fieldName={fieldName} />
            </li>
          ))}
        </ul>
      </div>

      <div className={`${block}__icon-wrapper`}>
        <SvgIcon type="triangle_right" color="#40535b" size="xs" />
      </div>

      <div className={`${block}__item-box`}>
        <div className={`${block}__header`}>Selected items</div>
        <ul className={`${block}__list`}>
          {selectedItems.map((item, i) => (
            <li key={i} className={`${block}__item`} onClick={() => onSelectedClick(item)}>
              <Item item={item} fieldName={fieldName} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
