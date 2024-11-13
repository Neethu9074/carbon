> :warning: Please update the description with all the elements below.
> If there are parts which do not apply, please remove them.
> Do remove the comments once they have been addressed.
> All this will help in getting your PR merged faster.

# Why

<!--
> Please describe why you are proposing this code change. This should include
> at least a single text paragraph. When possible formulate this from the
> perspective of the product team.
-->

# What

<!--
> Please explain what you did. For small/trivial changes a single paragraph is
> probably sufficient. For any larger changes this should include design
> choices.
-->

# How to test

<!--
> Add instructions for people testing this change if necessary
> Eventually, provide any URL for local testing, and/or Release URL for Release QA Testing
> a link like
>  https://local-instana.instana.rocks:4000/#/config
> makes local testing and review easier!
-->

# Release Branch PR Checklist

<!-- For PR delivered to release branch (release-NNN).-->
Answer at least the first question.  If test or doc change, you can ignore the rest, delete, or mark N/A.   If product change, complete the rest.

Questions/information for PRs going into the current release branch
- **Q: Is this PR for test code or product code?**
  - TODO
- **If product code, complete these fields:**
  - **Q: Customer Impact if change is not delivered until the next release:**
    - TODO
  - **Q: Is any new migration part of this change that would require a re-run of BCT?**
    - TODO
  - **Q: What (if any) other testing is required specific to this change?**
    - TODO

To merge the PR, reach out to an engineering manager, or anyone in the [release-approvers github group](https://github.ibm.com/orgs/instana/teams/release-approvers/members?page=2&query=)

# Other Checklist

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

- Story: CHANGE or REMOVE INSTA-12345
- [PLZ CHANGE or REMOVE:Documentation](http://example.com)
- [PLZ CHANGE or REMOVE:CSP](http://example.com)
- [PLZ CHANGE or REMOVE:Release Notes PR](https://github.ibm.com/instana/docs/compare)
- [PLZ CHANGE or REMOVE:Documentation PR](https://github.ibm.com/instana/docs/compare)

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
