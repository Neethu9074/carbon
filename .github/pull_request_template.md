> :warning: Please update the description with all the elements below.
> If there are parts which do not apply, please remove them.
> _Do remove_ the comments once they have been addressed. This will also show
> that this PR is complete and ready to review. THX
>
> All this will help in getting your PR merged faster 🏎️.

# Why

<!--
> Please describe why you are proposing this code change. 
> This should include at least a single text paragraph. 
> When possible formulate this from the perspective of the product team.
-->

# What

<!--
> Please explain what you did. For small/trivial changes a single paragraph is
> probably sufficient. 
> For any larger changes this might include design choices.
-->

# How to test

<!--
> Add instructions for people testing this change if necessary.
>
> Ideally, provide an URL for local testing.
-->

# Checklist


- Targeting a `release-xxx` branch?
  - Switch to the [Release Branch PR template](?expand=1&template=release_branch.md)!


<!--
> Please tick of these checklist items.
> When some of these aren't necessary for this PR, remove them.
-->

- [ ] Pull request tagged with one of the `type:*`[labels](https://github.ibm.com/instana/ui-client/blob/develop/docs/PR_WORKFLOW.md#applying-labels-to-your-pr)
- [ ] Feature flags added [as explained in the docs](https://ibm.ent.box.com/file/1428459969372?sb=/activity)
- [ ] Changes are visually consistent with current components
- [ ] New user facing components were discussed with our design community
- [ ] Add before/after screenshots
- [ ] Affected areas were tested manually and everything works as expected
- [ ] User facing change? Release Notes PR created and linked in references
- [ ] Documentation needs an update? Docs PR created and linked in references
- [ ] [Pull Request Guidelines](https://github.ibm.com/instana/ui-notion-pages/blob/main/Frontend-Enablement/Process/Pull-Request-Guidelines.md) applied
- [ ] Ensure Segment Instrumentation is done for team-wise product analytics.

<!--
Really, if not applicable, please REMOVE it.
-->

# References

<!--
> Please include links to other artifacts related to this code change.
-->

- Story: INSTA-12345
- [Documentation](http://example.com)
- [CSP Case](http://example.com)
- [Release Notes PR](https://github.ibm.com/instana/docs/compare)
- [Documentation PR](https://github.ibm.com/instana/docs/compare)

# Screenshots

<!--
> Please include one or more screenshots that show what this code change looks
> like in the UI. Please include screenshots to highlight special / edge cases.

> You can add screenshots either in a table side-by-side or for bigger screenshots, you can use the sections.
-->

| Before | After |
| ------ | ----- |
|        |       |
|        |       |

## After

<!--
> Please add any screenshot here to show how it looks after applying the changes. This helps to spot the visual changes easier.
-->

## Before

<!--
> Please add any screenshot of how it looked before the changes for easier comparison.
-->

# Merge Guidance

❗ Please use a **squash merge** unless there is an explicit reason you need to use a different merge strategy (e.g. you are bringing in changes from a previous release branch, or you have specific changes in your branch that you would like to retain). This keeps our commit history clean, makes changes more atomic, and makes it easier to revert changes.

<img width="200" alt="DoSquashMerge" src="https://media.github.ibm.com/user/365791/files/a8ee10ca-527e-4ad7-8bb9-b366509a8026">
