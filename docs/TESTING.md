# Guideline for unit testing
Some hints and best practices.

While migrating from mocha to jest, we found some test methods which failed when run with jest without the following adaptions:

## How to mock dependencies, migrating from proxyquire

A typical example to manipulate a configuration of a sub-dependency

```javascript
// old mocha+proxyquire based:
describe('in-websites/trackingSnippet', () => {
    it('must provide regular SAAS eum snippet', () => {
      let mod = loadModuleWithInjectedFeatureFlag({
        useInstanaSaasEumTrackingUrlEnabled: true
      });
      expect(mod.getTrackingSnippet()).toBe(`<script ... `)
    });

    function loadModuleWithInjectedFeatureFlag(injectedFlags) {
      mod = proxyquire('in-websites/trackingSnippet/trackingSnippet',{
        'in-services/featureFlags': injectedFlags,
      });
      return import('in-websites/trackingSnippet/trackingSnippet');
    }
})
```

```javascript
describe('in-websites/trackingSnippet', async () => {

  // reset for allowing using different values in each test
  beforeEach(() => {
    jest.resetModules();
  });

  it('must provide regular SAAS eum snippet', async () => {
    // if we want to test asynchronous code it's best to use async/await in order to make the tests easily readable
    const mod = await loadModuleWithInjectedFeatureFlag({
      useInstanaSaasEumTrackingUrlEnabled: true
    });

    expect(mod.getTrackingSnippet('foo')).toBe(`<script ... `);
  });

  // To override static exports, we need to use dynamic imports
  async function loadModuleWithInjectedFeatureFlag(injectedFlags) {
    // mock the module
    jest.doMock('in-services/featureFlags', () => {
      return {
        // To include **existing** module and all its exports:
        //...jest.requireActual('in-services/featureFlags'),
        // **for ES6 static exports**
        // __esModule: true,

        ...injectedFlags
      };
    });

    return import('in-websites/trackingSnippet/trackingSnippet');
  }
});
```
