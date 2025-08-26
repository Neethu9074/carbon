# Feature flags

There are three files that you need to edit to enable feature flags on Instana UI. 

## Steps

### Setup
you need 2 names for your feature flag

- `uiClientKey` - this will be camelCase and will be used as variables in the UI
- `instanaCtlKey` - this will be like a dot(.) separated key that will be used in the backend

## Example feature flag
- `uiClientKey` = `rcaUIEnabled`
- `instanaCtlKey` = `feature.rca.ui.enabled`

## Steps
1. Edit `dev/featureFlags.js`

```javascript
{
  ...,
  rcaUIEnabled: true,
}
```
This will enable the feature flag as a default on your local environment

2. Edit `packages/in-server/src/services/resolvers/featureFlags.js`

```javascript
[
  ...,
  {
    uiClientKey: 'rcaUIEnabled',
    instanaCtlKey: 'feature.rca.ui.enabled',
    defaultValue: false
  }
]
```
The defaultValue will set it to `true/false` on pink -> release. It is suggested setting it to `false` until the feature is ready.

3. Edit `packages/in-services/featureFlags.ts`

```typescript
export const rcaUIEnabled = isFeatureFlagEnabled('rcaUIEnabled', true);

```

You are now ready to use the feature flag in your code!

## Usage
1. Import

```javascript

import { rcaUIEnabled } from 'in-services/featureFlags';
```

2. Use

```jsx
  {rcaUIEnabled && <RCASection />}
```

## Things to consider

- If you are sharing a feature flag with backend, make sure the `instanaCtlKey` is consistent
- Once the feature is GA, make sure to have a cleanup task that removes the feature flags following the above steps.

## Learn more

[Instana feature flags](https://ibm.ent.box.com/file/1428459969372?sb=/activity)