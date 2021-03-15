/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildThemeDependentComponentSwitcher } from 'in-themes/themeDependentComponentSwitcher';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import LightCard from 'in-new-components/Card/LightCard';
import { light, lightV2 } from 'in-themes/themes';

export default buildThemeDependentComponentSwitcher({
  name: 'Card',
  definitions: {
    [light]: LightCard,
    [lightV2]: LightCardV2
  }
});
