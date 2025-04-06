/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { SvgIconSizes } from '@instana/components';
import { themes } from '@instana/design-tokens';

import UserIcon from 'in-components/UserIcon/UserIcon';

export default {
  component: UserIcon,
  argTypes: {
    size: {
      control: 'select',
      options: SvgIconSizes
    }
  },
  args: {
    type: 'lib_menu_account',
    size: 'l',
    color: themes.default.ids.color.option.neutral['500']
  }
};
export const Default = { args: {} };
