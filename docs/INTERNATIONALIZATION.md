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

## Tips/Gotchas

 - Merge in the latest changes from `develop` to ensure that you have the latest and
   greatest automatic checks. This is also a good opportunity to fix conflicts.
 - Before/during/after: Check for consistency between the JavaScript files and the
   `en-US.json` files via `yarn test`. In case of detected issues, the output will
   list the unknown translation keys.
 - Carefully validate the used i18next [context] and [interpolation parameters] across the
   JSON and JS files as these cannot be automatically verified in our tests.
 - Do not translate logger statements.
 - Do not translate JavaScript error messages, e.g. `new Error(…)`.
 - Do not translate Mixpanel API calls and `in-services/tracking/ViewTrackingMeta` usages.
 - Do not translate `in-server`.
 - Translation of `in-internal` is optional.

[context]: https://www.i18next.com/translation-function/context
[interpolation parameters]: https://www.i18next.com/translation-function/interpolation
