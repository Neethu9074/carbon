// each exported const is named the following way:
// ${type}_${operator}

export const STRING_EQUALS = '=';
export const STRING_NOT_EQUAL = '!=';
export const STRING_CONTAINS = 'contains';
export const STRING_NOT_CONTAIN = 'does not contain';
export const STRING_NOT_EMPTY = 'is present';
export const STRING_IS_EMPTY = 'is not present';
export const STRING_STARTS_WITH = 'starts with';
export const STRING_ENDS_WITH = 'ends with';
export const STRING_NOT_STARTS_WITH = 'does not start with';
export const STRING_NOT_ENDS_WITH = 'does not end with';

export const STRING_EQUALS_DESCRIPTION = 'equals';
export const STRING_NOT_EQUAL_DESCRIPTION = 'does not equal';

export const STRING_SET_EQUALS = STRING_EQUALS;
export const STRING_SET_NOT_EQUAL = STRING_NOT_EQUAL;
export const STRING_SET_CONTAINS = STRING_CONTAINS;
export const STRING_SET_NOT_CONTAIN = STRING_NOT_CONTAIN;
export const STRING_SET_NOT_EMPTY = STRING_NOT_EMPTY;
export const STRING_SET_IS_EMPTY = STRING_IS_EMPTY;
export const STRING_SET_STARTS_WITH = STRING_STARTS_WITH;
export const STRING_SET_ENDS_WITH = STRING_ENDS_WITH;
export const STRING_SET_NOT_STARTS_WITH = STRING_NOT_STARTS_WITH;
export const STRING_SET_NOT_ENDS_WITH = STRING_NOT_ENDS_WITH;

export const STRING_SET_EQUALS_DESCRIPTION = STRING_EQUALS_DESCRIPTION;
export const STRING_SET_NOT_EQUAL_DESCRIPTION = STRING_NOT_EQUAL_DESCRIPTION;

export const STRING_LIST_EQUALS = STRING_SET_EQUALS;
export const STRING_LIST_NOT_EQUAL = STRING_SET_NOT_EQUAL;
export const STRING_LIST_CONTAINS = STRING_SET_CONTAINS;
export const STRING_LIST_NOT_CONTAIN = STRING_SET_NOT_CONTAIN;
export const STRING_LIST_NOT_EMPTY = STRING_SET_NOT_EMPTY;
export const STRING_LIST_IS_EMPTY = STRING_SET_IS_EMPTY;
export const STRING_LIST_STARTS_WITH = STRING_SET_STARTS_WITH;
export const STRING_LIST_ENDS_WITH = STRING_SET_ENDS_WITH;
export const STRING_LIST_NOT_STARTS_WITH = STRING_SET_NOT_STARTS_WITH;
export const STRING_LIST_NOT_ENDS_WITH = STRING_SET_NOT_ENDS_WITH;

export const STRING_LIST_EQUALS_DESCRIPTION = STRING_EQUALS_DESCRIPTION;
export const STRING_LIST_NOT_EQUAL_DESCRIPTION = STRING_NOT_EQUAL_DESCRIPTION;

export const NUMBER_EQUALS = '=';
export const NUMBER_NOT_EQUAL = '!=';
export const NUMBER_LESS_THAN = '<';
export const NUMBER_GREATER_THAN = '>';
export const NUMBER_NOT_EMPTY = 'is present';
export const NUMBER_IS_EMPTY = 'is not present';
export const NUMBER_LESS_OR_EQUAL_THAN = '<=';
export const NUMBER_GREATER_OR_EQUAL_THAN = '>=';
// support string operators, currently used only for the 'call.http.status' tag
export const NUMBER_CONTAINS = 'contains';
export const NUMBER_NOT_CONTAIN = 'does not contain';
export const NUMBER_STARTS_WITH = 'starts with';
export const NUMBER_ENDS_WITH = 'ends with';
export const NUMBER_NOT_STARTS_WITH = 'does not start with';
export const NUMBER_NOT_ENDS_WITH = 'does not end with';

export const BOOLEAN_EQUALS = 'is';

export const KEY_VALUE_PAIR_EQUALS = 'equals';
export const KEY_VALUE_PAIR_NOT_EQUAL = 'does not equal';
export const KEY_VALUE_PAIR_CONTAINS = 'contains';
export const KEY_VALUE_PAIR_NOT_CONTAIN = 'does not contain';
export const KEY_VALUE_PAIR_NOT_EMPTY = 'is present';
export const KEY_VALUE_PAIR_IS_EMPTY = 'is not present';
export const KEY_VALUE_PAIR_IS_BLANK = 'does not have value';
export const KEY_VALUE_PAIR_NOT_BLANK = 'has value';
export const KEY_VALUE_PAIR_STARTS_WITH = 'starts with';
export const KEY_VALUE_PAIR_ENDS_WITH = 'ends with';
