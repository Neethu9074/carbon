# ComboBox

## Usage

ComboBox is useful in the below scenarios.

1. When we have a large number of options to the underlying select and therefore it's easier for the user to filter options using the search query.
2. When we want the user to select multiple options. Native select would no longer be displayed as a Combobox as it always shows all options.

NOTE: We are using react-select under the hood.

## Existing usages:

1. [ProvideStatusCode](../../in-alerting/smart-alerts/applications/components/ProvideStatusCode.js)

## Best Practices:

Prefer Select over ComboBox whenever possible. For e.g., below usage of Combobox could be replaced by Select.

```js
import React, { useState } from 'react';
import ComboBox from 'in-components/ComboBox';
import { t } from 'in-i18n';

const [value, setValue] = useState('INFO');

const options = Object.freeze([
  { value: 'INFO', label: t('in-alerting:logLevel.info') },
  { value: 'DEBUG', label: t('in-alerting:logLevel.debug') }
]);

<ComboBox
  id="someId"
  name="someName"
  value={value}
  options={options}
  onChange={setValue}
  isClearable={false}
/>
```

```js
import React, { useState } from 'react';
import Select from 'in-components/form/Select';
import { t } from 'in-i18n';

const [value, setValue] = useState('INFO');

<Select
  id="someId"
  value={value}
  onChange={setValue}
  autoFocus
>
  <option value="INFO">{t('in-alerting:logLevel.info')}</option>
  <option value="DEBUG">{t('in-alerting:logLevel.debug')}</option>
</Select>
```

# ComboBoxBehavior

## Usage

ComboBoxBehavior is useful when you want to have a combobox behaviour for the underlying custom component.

NOTE: We are not using react-select under the hood.

## Existing usages:

  1. [TimeSelection](../../../in-amp/components/TimeSelection.js)
  2. [ChartingConfiguratorForm](../../../in-components/ChartingConfigurator/ChartingConfiguratorForm.js)
  3. [TimeInput](../../../in-components/TimeInput/TimeInput.js)
