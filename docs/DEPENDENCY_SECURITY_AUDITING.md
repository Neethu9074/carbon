# Dependency Security Auditing

We have an obligation to ensure that our ui-client itself and its dependencies
conform to our security requirements. One of which is that we address security
issues in our dependencies.

## How to execute an audit

To execute an audit, you need to execute the following command within the
ui-client repository root. Note, that this command only audits production
dependencies. Production dependencies are the primary auditing target we
have to address. Development and peer dependency audits typically result
in a lot of false positives.

```sh
yarn audit --groups dependencies
```

## Known / Ignored Production Dependency Security Warnings

### three

The vulnerability does not cause any problem for us because we encapsulate
three functionality completely, there is no way it can harm the overall functionality.

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ high          │ Regular Expression Denial of Service                         │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ three                                                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=0.125.0                                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ three                                                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ three                                                        │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://www.npmjs.com/advisories/1639                        │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

### sockjs-client > eventsource > original > url-parse

We only hand fixed/secure URLs to sockjs-client. As a consequence,
this is not an issue we need to address.


```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ high          │ Path traversal                                               │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ url-parse                                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=1.5.0                                                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ sockjs-client                                                │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ sockjs-client > eventsource > original > url-parse           │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://www.npmjs.com/advisories/1678                        │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

### recompose > fbjs > isomorphic-fetch > node-fetch

The transitive dependency is actually unused. Therefore this is not a security
issue.

```
┌───────────────┬──────────────────────────────────────────────────────────────┐
│ low           │ Denial of Service                                            │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Package       │ node-fetch                                                   │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Patched in    │ >=2.6.1 <3.0.0-beta.1|| >= 3.0.0-beta.9                      │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Dependency of │ recompose                                                    │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ Path          │ recompose > fbjs > isomorphic-fetch > node-fetch             │
├───────────────┼──────────────────────────────────────────────────────────────┤
│ More info     │ https://www.npmjs.com/advisories/1556                        │
└───────────────┴──────────────────────────────────────────────────────────────┘
```
