# Feature Flags

To change a feature flag for a test run, you can do the following, assuming the flag is called `myFeatureFlagEnabled:

```js
jest.mock('in-services/featureFlags', () => ({
  get myFeatureFlagEnabled() {
    return true;
  }
}));
```
