# GitHub Labels

According to our [branching model](https://miro.com/app/board/o9J_kx-xBuY=/), we create several PRs. When doing so, the description is pre-filled with a template. It describes how and why it's filled. Please make sure, you also set proper labels to mark your PR:

- "depends on backend changes": This is set when your PR depends on changes in the backend, so they need to get merged together. If this is the case, please also link the corresponding PR in your description.
- "do not merged": Work-in-progress branches are usually marked with the "WIP" label. This is only used to really mark, that the current PR is very experimental.
- "master": Obsolete. It was used to mark, that the PR is configured to be merged against the master branch.
- "needs discussion": The PR owner is actively asking for feedback on the PR and the ideas/concept behind it.
- "Review & Merge": Use this label, if you want somebody to review and merge this PR when there are no remarks.
- "waiting for design": Mostly unused. It marks a PR to be ready code-wise but blocked by missing design. Caution: If you are blocked by design, please make your PM and team aware of this and track this in your Project-Tool.
- "WIP": When you are currently working on a branch but want to still create a PR, use this label to reflect, that you are still working on this branch.
- "type:XY": These type-labels tell the reviewer the intention of the change.
