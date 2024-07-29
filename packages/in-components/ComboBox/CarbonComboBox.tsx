/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// Carbon version of ComboBox for single select
import { ComboBox as CarbonComboBox, ComboBoxProps as CarbonComboBoxProps } from '@instana/components';

import type { ComboBoxProps, Option } from './types';
import { t } from 'in-i18n';

export default function ComboBox({...props }: ComboBoxProps): JSX.Element {
    const selopt = props.value ? props.options.find((e) => e.value === props.value) : props.value;
    const cprops: CarbonComboBoxProps = {
      ...props,
      placeholder: props.placeholder ? props.placeholder : t('in-components:comboBox.placeholderSelect'),
      value: selopt as Option
    };
    return <CarbonComboBox {...cprops} />;

}
