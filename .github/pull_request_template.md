# Classification

> Please help your reviewers classify this pull request by defining what kind
> of PR this is.

 - [ ] Bug fix
 - [ ] User-facing feature
 - [ ] Internal feature
 - [ ] Automated tests
 - [ ] Refactoring
 - [ ] Technical improvement
 - [ ] Code documentation

# Why

> Please describe why you are proposing this code change. This should include
> at least a single text paragraph. When possible formulate this from the
> perspective of the product team.

# What

> Please explain what you did. For small/trivial changes a single paragraph is
> probably sufficient. For any larger changes this should include design
> choices.

# References

> Please include links to other artifacts related to this code change.

 - [Story](http://example.com)
 - [Documentation](http://example.com)
 - [Zendesk](http://example.com)
 - [Release Notes PR](http://example.com)
 - [Documentation PR](http://example.com)

# Screenshots

> Please include one or more screenshots that show what this code change looks
> like in the UI. Please include screenshots to highlight special / edge cases.
> Also screenshots of various states that the UI can be in are very helpful for
> your reviewers!

# Checklist

> Please tick of these checklist items. When some of these aren't necessary for
> this PR, then please describe why.

 - Feature flags added?
   - [ ] To the server side: `/packages/in-server/services/resolvers/consul.js`
   - [ ] To the server side (for Kubernetes based deployments): `{{backendRepository}}/instanactl/config/components/ui-client.yaml.tpl`
   - [ ] For the development mode: `/dev/featureFlags.js`
   - [ ] For the in-browser code (this is what you would import): `/packages/in-services/featureFlags.es6`
   - [ ] A tracker item (Pivotal or similar) has been added to remove all feature flags introduced in this PR in a later release, once the feature has been rolled out.
 - [ ] Changes are visually consistent to current components?
 - [ ] New user facing components were discussed with our design community?
 - [ ] New user facing components are represented within Storybook?
 - [ ] Simon sort?
