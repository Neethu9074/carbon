# Feature Flags

To change a feature flag for a test run, you can do the following:

```js
jest.mock('in-services/featureFlags', () => ({
  get adaptiveBaselineEnabled() {
    return true;
  }
}));
```
