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
  fieldName,
  addNewItem,
  NewItemComponent
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
          {addNewItem ? (
            <li key="add_new" className={`${block}__item`} onClick={addNewItem}>
              {NewItemComponent ? <NewItemComponent /> : '+ Add New'}
            </li>
          ) : null}
        </ul>
      </div>

      <div className={`${block}__icon-wrapper`}>
        <SvgIcon type="triangle_right" color="#40535b" height={16} width={16} />
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
