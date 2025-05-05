# Internationalization (i18n)

The Instana user interface needs to support multiple locales. At the time of writing, the largest
part of the user interface cannot be localized yet. This document describes what you should do
for all newly written code and for the code that you are refactoring.

## Quick Start

 - Each package, i.e. directory within the `packages/` directory may have a directory called `i18n`
   that contains translation files. For example `packages/in-custom-dashboards/i18n/en.json`.
 - The translation files' file names must match our supported locales suffixed with `.json`.
   For example `en-US`, `de-DE`and others. The language codes stem from
   [BCP47](https://tools.ietf.org/html/bcp47).
 - We are using i18next. Refer to the [i18next](https://www.i18next.com/) and
   [react-i18next](https://react.i18next.com/) websites to learn more about the
   i18n concepts, facilities and components we are using. Specifically learn about
   [namespaces](https://www.i18next.com/principles/namespaces).
 - Each package is turned into a i18next namespace. The namespace is the name of the package
   directory. The `in-i18n` package is treated differently and is responsible for the `common`
   namespace (which is configured as the default namespace).
 - Instana RND department members must only populate the `en-US.json` files. Translations for
   other languages will be provided by the IBM globalization team.
 - Only use the `<Trans>` component when necessary. Prefer usage of the `t` function whenever
   possible (it is a lot more efficient and contains fewer pitfalls).

## Usage Example

Please refer to the [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/)
websites more elaborate usage examples, e.g. about pluralization, interpolation and more.

### Simple Translation

#### Translation File

File: `packages/in-cockpit/i18n/en-US.json`

```json
{
  "deployAgent": "Deploy Agent"
}
```

#### React Component
```js
import { t } from 'in-i18n';

t('in-cockpit:deployAgent')
```

⚠️️ Only in the special case when the translated text contains simple html markup like `<strong>`, then it is necessary to use `<Trans />`
```json
{
  "deployStrongAgent": "Deploying Agent: <strong>Smith</strong>"
}
```

```js
import { Trans } from 'in-i18n';

<Trans
  i18nKey="in-cockpit:deployStrongAgent"
/>
```

### Guidelines for using [context](https://www.i18next.com/translation-function/context) instead of `string concatenation/string interpolation` with i18n key

⚠️️ Do not use/define i18n keys like below as it does not help us to catch unused keys in en-US files.

Below example, alertType has two values but in ideal scenario we could have `n` number of different values for a given constant which we want to use dynamically.

```js
import { t } from 'in-i18n';

const alertType = isSmart ? 'smart' : 'dumb';

t('in-alerting:alerts.component.' + alertType);
t(`in-alerting:alerts.component.${alertType}`);
```
for above code respective en-US.json would look something like this.

```json
{
  "alerts": {
    "component": {
      "smart": "smart",
      "dumb": "dumb"
    }
  }
}
```

👍 We need to replace above part as below using context.

```js
import { t } from 'in-i18n';

const alertType = isSmart ? 'smart' : 'dumb';

t('in-alerting:alerts.component', { context: alertType });
```
respective json would change as below

```json
{
  "alerts": {
    "component_smart": "smart",
    "component_dumb": "dumb"
  }
}
```

### Pluralization

[Plurals can differ between languages](https://www.i18next.com/translation-function/plurals). Since our current set of automatic translation tools does not add new keys,
we specify the following set of keys already in english, even though they will be always identical.

```json
{
  "component": {
    "services": "{{count}} Service",
    "services_plural": "{{count}} Services",
    "services_0": "{{count}} Services",
    "services_1": "{{count}} Services",
    "services_2": "{{count}} Services"
  }
}
```
❗️️ The texts for `_0`, `_1`, `_2` should be a copy of the `_plural` text and contain the `{{count}}` parameter.
This will be used in other translations (e.g. Japanese)

## Tips/Gotchas

 - Merge in the latest changes from `develop` to ensure that you have the latest and
   greatest automatic checks. This is also a good opportunity to fix conflicts.
 - Before/during/after: Check for consistency between the JavaScript files and the
   `en-US.json` files via `yarn test`. In case of detected issues, the output will
   list the unknown translation keys.
 - Carefully validate the used i18next [context] and [interpolation parameters] across the
   JSON and JS files as these cannot be automatically verified in our tests.
 - Do not alias the `t` function or the `Trans` component to any other names. We rely on
   these for static source code analysis.
 - Do not translate logger statements.
 - Do not translate JavaScript error messages, e.g. `new Error(…)`.
 - Do not translate Segment API calls and `in-components/ViewTrackingMeta` usages.
 - Translation of `in-internal` is optional.

[context]: https://www.i18next.com/translation-function/context
[interpolation parameters]: https://www.i18next.com/translation-function/interpolation

## Patterns

### Table Columns With Minimum Width

Sometimes, you want a table column to use the minimum amount of space necessary *without* wrapping the content.
In those cases, you can set `useMinimumAmountOfHorizontalSpace` on `Td`, `Th` and on table column definitions.
