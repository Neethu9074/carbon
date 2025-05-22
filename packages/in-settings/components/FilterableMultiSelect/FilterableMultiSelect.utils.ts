/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

export const defaultFilterItems = (
  items: Array<FilterableMultiSelectItemProps>,
  extra: FilterableMultiSelectItemExtraProps
): Array<FilterableMultiSelectItemProps> => {
  return items.filter(item => {
    if (!extra.inputValue) {
      return true;
    }
    return extra.itemToString(item).toLowerCase().includes(extra.inputValue.toLowerCase());
  });
};

export interface FilterableMultiSelectItemProps {
  id: string;
  text: string;
}

export interface FilterableMultiSelectItemExtraProps {
  itemToString: (item: FilterableMultiSelectItemProps | null) => string;
  inputValue: string;
}
