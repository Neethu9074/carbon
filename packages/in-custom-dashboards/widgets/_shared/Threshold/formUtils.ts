/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Option } from 'in-components/ComboBox/ComboBox';

type ValueLabelPair = {
  value: string;
};

export function findEntryByValue(valueLabelPairList: Option[], value?: string): ValueLabelPair | undefined {
  const items = valueLabelPairList ?? [];
  return items.find(item => item?.value === value);
}
