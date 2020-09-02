# Code Style

Most code style rules are checked by linters, also, code formatting is applied by prettier. Linters and prettier are run automatically by a pre-commit hook on all files which have staged changes. If possible, you should [configure your IDE/Editor](#running-prettier-on-save) to run prettier on all files when saving the file.

_CAUTION:_ If you use `git add --patch` to only commit a portion of a file's changes while excluding other changes in the same file from the commit by not adding them, the pre-commit hook will still add the whole file with all changes, so that won't work.

## Simon Sort

There is one style rule that is not automatically enforced or taken care of (yet): _Simon sort_. This is our rule on how to sort imports in ES6 files. We split all imports into three blocks (not all three blocks are present in each file):

1. Third party imports (React, Lodash, ...) first, then
2. Instana imports (everything from one of the packages in `ui-client/packages/`, and finally
3. CSS/LESS imports (all `*.less` and `*.mless` files).

These blocks are separated by a new line. The first import block usually starts at the first line of the file (that is, there is nothing else above the imports).

The imports in one block are _sorted by line length, descending_. The longest import line at the top, the shortest line at the bottom.

Basically, this is our (totally arbitrary, but at least consistent) rule for sorting imports. The main reason it was chosen is that it can be verified very quickly visually without inspecting the individual imports.

Here is an example of some imports, correctly simon-sorted:

```
import { get } from 'lodash';
import React from 'react';

import TreeHeader from 'in-analyze/TraceDetail/components/CallTree/components/TreeHeader';
import { getStart, getEnd } from 'in-analyze/TraceDetail/components/callStartAndEndTime';
import LoadingCallTree from 'in-analyze/TraceDetail/components/CallTree/LoadingCallTree';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Row from 'in-analyze/TraceDetail/components/CallTree/components/Row';
import createScale from 'in-services/scale';

import locals from './CallTree.mless';

export default function CallTree({
  ...
```

## Running Prettier On Save

### VS Code

Install the "Prettier - Code formatter" code extension and the `sort-imports` extension. Both of these are in our suggested extensions, i.e. VS Code should prompt you to install these once you open up the ui-client repo in VS Code.

### IntelliJ & Co

- Install the Prettier plugin (by JetBrains) and use these defaults:
  - Prettier package: <Project_RootDir>/node_modules/prettier
  - ✔️ Activate "run on save for files:"  ({**/*,*}.{js,jsx})

### VIM

- Install https://github.com/prettier/vim-prettier
- Add the following to `~/.vimrc`:

```
" run prettier on JavaScript/CSS files when saving
let g:prettier#autoformat = 0
autocmd BufWritePre *.js,*.jsx,*.mjs,*.ts,*.tsx,*.css,*.less,*.scss,*.json,*.graphql PrettierAsync
```
