/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';
// each exported const is named the following way:
// ${type}_${operator}

export const STRING_EQUALS = '=';
export const STRING_NOT_EQUAL = '!=';
export const STRING_CONTAINS = t('in-components:queryBuilder.string.contains');
export const STRING_NOT_CONTAIN = t('in-components:queryBuilder.string.doesNotContain');
export const STRING_NOT_EMPTY = t('in-components:queryBuilder.string.isPresent');
export const STRING_IS_EMPTY = t('in-components:queryBuilder.string.isNotPresent');
export const STRING_STARTS_WITH = t('in-components:queryBuilder.string.startsWith');
export const STRING_ENDS_WITH = t('in-components:queryBuilder.string.endsWith');
export const STRING_NOT_STARTS_WITH = t('in-components:queryBuilder.string.doesNotStartWith');
export const STRING_NOT_ENDS_WITH = t('in-components:queryBuilder.string.doesNotEndWith');
export const STRING_IS_BLANK = t('in-components:queryBuilder.string.isBlank');
export const STRING_NOT_BLANK = t('in-components:queryBuilder.string.notBlank');

export const STRING_EQUALS_DESCRIPTION = t('in-components:queryBuilder.string.equals');
export const STRING_NOT_EQUAL_DESCRIPTION = t('in-components:queryBuilder.string.doesNotEqual');

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
export const STRING_SET_IS_BLANK = STRING_IS_BLANK;
export const STRING_SET_NOT_BLANK = STRING_NOT_BLANK;

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
export const STRING_LIST_IS_BLANK = STRING_IS_BLANK;
export const STRING_LIST_NOT_BLANK = STRING_NOT_BLANK;

export const STRING_LIST_EQUALS_DESCRIPTION = STRING_EQUALS_DESCRIPTION;
export const STRING_LIST_NOT_EQUAL_DESCRIPTION = STRING_NOT_EQUAL_DESCRIPTION;

export const NUMBER_EQUALS = '=';
export const NUMBER_NOT_EQUAL = '!=';
export const NUMBER_LESS_THAN = '<';
export const NUMBER_GREATER_THAN = '>';
export const NUMBER_NOT_EMPTY = t('in-components:queryBuilder.number.isPresent');
export const NUMBER_IS_EMPTY = t('in-components:queryBuilder.number.isNotPresent');
export const NUMBER_LESS_OR_EQUAL_THAN = '<=';
export const NUMBER_GREATER_OR_EQUAL_THAN = '>=';
// support string operators, currently used only for the 'call.http.status' tag
export const NUMBER_CONTAINS = t('in-components:queryBuilder.number.contains');
export const NUMBER_NOT_CONTAIN = t('in-components:queryBuilder.number.doesNotContain');
export const NUMBER_STARTS_WITH = t('in-components:queryBuilder.number.startsWith');
export const NUMBER_ENDS_WITH = t('in-components:queryBuilder.number.endsWith');
export const NUMBER_NOT_STARTS_WITH = t('in-components:queryBuilder.number.doesNotStartWith');
export const NUMBER_NOT_ENDS_WITH = t('in-components:queryBuilder.number.doesNotEndWith');

export const BOOLEAN_EQUALS = t('in-components:queryBuilder.booleanIs');

export const KEY_VALUE_PAIR_EQUALS = t('in-components:queryBuilder.keyValuePair.equals');
export const KEY_VALUE_PAIR_NOT_EQUAL = t('in-components:queryBuilder.keyValuePair.doesNotEqual');
export const KEY_VALUE_PAIR_CONTAINS = t('in-components:queryBuilder.keyValuePair.contains');
export const KEY_VALUE_PAIR_NOT_CONTAIN = t('in-components:queryBuilder.keyValuePair.doesNotContain');
export const KEY_VALUE_PAIR_NOT_EMPTY = t('in-components:queryBuilder.keyValuePair.isPresent');
export const KEY_VALUE_PAIR_IS_EMPTY = t('in-components:queryBuilder.keyValuePair.isNotPresent');
export const KEY_VALUE_PAIR_IS_BLANK = t('in-components:queryBuilder.keyValuePair.isBlank');
export const KEY_VALUE_PAIR_NOT_BLANK = t('in-components:queryBuilder.keyValuePair.notBlank');
export const KEY_VALUE_PAIR_STARTS_WITH = t('in-components:queryBuilder.keyValuePair.startsWith');
export const KEY_VALUE_PAIR_ENDS_WITH = t('in-components:queryBuilder.keyValuePair.endsWith');

export const KEY_NUMBER_PAIR_EQUALS = '=';
export const KEY_NUMBER_PAIR_NOT_EQUAL = '!=';
export const KEY_NUMBER_PAIR_LESS_THAN = '<';
export const KEY_NUMBER_PAIR_GREATER_THAN = '>';
export const KEY_NUMBER_PAIR_NOT_EMPTY = t('in-components:queryBuilder.number.isPresent');
export const KEY_NUMBER_PAIR_IS_EMPTY = t('in-components:queryBuilder.number.isNotPresent');
export const KEY_NUMBER_PAIR_LESS_OR_EQUAL_THAN = '<=';
export const KEY_NUMBER_PAIR_GREATER_OR_EQUAL_THAN = '>=';

export const FLOAT_LIST_EQUALS = NUMBER_EQUALS;
export const FLOAT_LIST_NOT_EQUAL = NUMBER_NOT_EQUAL;
export const FLOAT_LIST_LESS_THAN = NUMBER_LESS_THAN;
export const FLOAT_LIST_GREATER_THAN = NUMBER_GREATER_THAN;
export const FLOAT_LIST_NOT_EMPTY = NUMBER_NOT_EMPTY;
export const FLOAT_LIST_IS_EMPTY = NUMBER_IS_EMPTY;
export const FLOAT_LIST_LESS_OR_EQUAL_THAN = NUMBER_LESS_OR_EQUAL_THAN;
export const FLOAT_LIST_GREATER_OR_EQUAL_THAN = NUMBER_GREATER_OR_EQUAL_THAN;
export const FLOAT_LIST_CONTAINS = NUMBER_CONTAINS;
export const FLOAT_LIST_NOT_CONTAIN = NUMBER_NOT_CONTAIN;
