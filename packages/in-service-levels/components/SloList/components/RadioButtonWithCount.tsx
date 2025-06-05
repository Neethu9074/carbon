/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ComponentProps } from 'react';

import { RadioButton } from '@instana/carbon';
import { Stack } from '@instana/components';

export default function RadioButtonWithCount({
  labelText,
  value,
  count,
  ...rest
}: {
  labelText: string;
  value: string | undefined;
  count: number | undefined;
} & ComponentProps<typeof RadioButton>) {
  return (
    <Stack direction="horizontal" distribution="spaceBetween">
      <RadioButton labelText={labelText} value={value} {...rest} />
      {count !== undefined && `(${count})`}
    </Stack>
  );
}
