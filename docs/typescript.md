# TypeScript Usage in ui-client

## Tooling

- The Webpack dev mode will check for type errors and present them within its dev output (see `/build/gulp/dev.js`).
- The TypeScript compiler is leveraged for type checking as part of the pre-commit hook and CI (see `/package.json`).
- We leverage eslint to lint TypeScript code (see `/.eslintrc.js`).
- Visual Studio Code linting and type checking works out of the box.

## Cheat Sheets

- https://github.com/typescript-cheatsheets/react
- https://react-typescript-cheatsheet.netlify.app/docs/basic/recommended/resources/

## Screencasts

We have a set of screencasts available to explain how to leverage TypeScript within
ui-client. You can find these screencasts over on [Google Drive].

[google drive]: https://drive.google.com/drive/folders/15MEbnrhGV582UaifkUxyelDt1IhuhkWn

## Educational Material

- https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- See cheat sheets listed above
- You are now sure what something evaluates to? Try the [TypeScript playground](https://www.typescriptlang.org/play).

## Migration Approach

Our migration approach is to add typings to ui-client over time. We starting
to translate [commonly imported modules](https://docs.google.com/spreadsheets/d/11zWrlFq-thfgCElw9kqNvUfrxfoe6SIvODK3vwvoZvY/edit#gid=632086686) and work ourselves
towards more end-user facing modules.

## Guidelines

Unless otherwise defined within this file, the styleguide from
[TypeScript Deep Dive](https://basarat.gitbook.io/typescript/styleguide)
applies. For React specific best practices, refer to the
[React cheat sheet](https://github.com/typescript-cheatsheets/react) unless
otherwise documented in this file.

### Type Checking

#### Use `@ts-expect-error` over `@ts-ignore`

Sometimes you need to suppress linter warnings, please use `@ts-expect-error` over `@ts-ignore`.

TLDR

> This directive operates in the same manner as @ts-ignore, but will error if the line it's meant to be suppressing doesn't actually contain an error, making it a lot safer.

Description

> TypeScript allows you to suppress all errors on a line by placing a single-line comment or a comment block line starting with @ts-ignore immediately before the erroring line. While powerful, there is no way to know if a @ts-ignore is actually suppressing an error without manually investigating what happens when the @ts-ignore is removed.
> This means its easy for @ts-ignores to be forgotten about, and remain in code even after the error they were suppressing is fixed. This is dangerous, as if a new error arises on that line it'll be suppressed by the forgotten about @ts-ignore, and so be missed.
> This directive operates in the same manner as @ts-ignore, but will error if the line it's meant to> be suppressing doesn't actually contain an error, making it a lot safer.

For more information see respective [typescript-eslint page](https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-ts-expect-error.md)

### Types vs. Interfaces

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
- https://github.com/typescript-cheatsheets/react/blob/main/README.md#types-or-interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable. According to recommendations found on various sources, we want to try to go with interfaces first until we will hit a point where a type is unavoidable.
One example for choosing a type instead of an interface could be that one wants to combine multiple types, e.g. (type CommonMouseEvent : MouseEvent | React.MouseEvent). Using interfaces, one would need to create a new interface and extend from both.

### Enums

We prefer **NOT** to use the TypeScript [enums](https://www.typescriptlang.org/docs/handbook/enums.html)
feature. Also see the [cheat sheet for rationale](https://github.com/typescript-cheatsheets/react/blob/main/README.md#enum-types).

Instead, we prefer union types of string literals.Example:

```ts
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
```

#### Naming

We prefer singular nouns shall use all upper snake case (`TAG_FILTER`).
This is consistent to our previously used constant naming conventions
and to the naming conventions found within the Instana backend. As a result,
we hope to avoid some confusion/make debugging easier down the road.

- Good: `UP` \ `TAG_FILTER`
- Bad: `up` / `tagFilter`

### Backend Types

A lot of types used within the UI are defined within the backend. More specifically,
within the `ui-model` and `api-model` backend modules. The UI relies heavily on
these types, e.g., to request data and to process/present data. To account for this,
we have [a generator] that turns the types found within the backend (Java code/OpenAPI
specs) into TypeScript type definitions.

The generated types reside within the `in-types/backend.d.ts` file and they get updated
via automatically created pull requests on every delivery branch (`^develop|release-*$`) commit
in the backend repository.

You can import the backend types via `import { … } from 'in-types';`. Please do not import
`in-types/backend` directory!

[a generator]: https://github.com/instana/backend/blob/develop/ui/typescript-generation/README.md

### Shared / Global Types

Please avoid putting types in a global package / to define a global unless those types are truly
undeniably global. In all likelihood, the case you are working on doesn't fit this requirement.
When in doubt, consult the UI community via `#tech-ui-dev` on Slack. Prefer to place types
as outlined within the next section.

### Placement of Types

For type definitions (`interface` / `type`), we prefer to place the type definitions next to the
implementation whenever possible. This means code like the following:

```js
export interface BananaProps {
  …
}

export default function Banana({ … }: BananaProps) {
  return (
    …
  );
}
```

There are cases for which we allow to place type definitions in separate files (`types.ts`).
However, we should generally try to avoid this.

1.  For complicated sub-systems of the UI for which we didn't want to risk
    circular import paths (now and down the road). A good example for such a case are our
    charts.
2.  For cases in which users of a package will never have to import any of the types unless
    they build something advanced on top of it. A good example for such a case are our
    http and connection module.

### Declaration for existing JavaScript files

We generally prefer not to add separate type declaration files for JavaScript files that
are under our control. Instead, please translate the JavaScript files to TypeScript.
Occassionally, this means that translation take a lot more time. We are aware of this
and accept this downside.

### On React higher-order components (HOCs)

React HOCs, e.g., `recompose`, `connectTo` and others within the `in-hoc` package
shall not be translated to TypeScript. Instead, refactor the file leveraging HOCs
to use React hooks instead.

### Stylesheet / CSS Module Imports

At the moment, TypeScript cannot interpret imports to `./Banana.mless` files and others
properly. Until this is fixed, please add a comment `// @ts-expect-error` above the
import statement.

### React Specifics

#### PropTypes

PropTypes can be easily translated into regular types or interfaces like this.
Once done, you can delete the React `prop-type` definition, i.e., the non-TypeScript
prop type definitions.

```javascript
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
};
```

```typescript
const type Props = {
  title: string,
  subTitle?: string
}
```

Prop types can be used like this now

```typescript
const MyComponent = ({ title }: Props) => <div>{title}</div>;
```

```typescript
class MyComponent extends React.Component<Props> {
  ...
}
```

## Types extracted from backend

Our backend repository contains a lot of type definitions of models that are used throughout the UI. Some examples:

- [Result](https://github.com/instana/backend/blob/b8f5e05818bacd199d7c2b97fc93d538913dea87/ui-model/src/main/java/com/instana/ui/model/result/Result.java)

- [TimeConfig](https://github.com/instana/backend/blob/b8f5e05818bacd199d7c2b97fc93d538913dea87/ui-model/src/main/java/com/instana/ui/model/query/TimeConfig.java)

- [GetUnifiedMetricsQuery](https://github.com/instana/backend/blob/b8f5e05818bacd199d7c2b97fc93d538913dea87/ui-model/src/main/java/com/instana/ui/model/unifiedmetrics/GetUnifiedMetricsQuery.java)

Instead of manually defining all of these APIs within ui-client, it makes more sense to automatically generate them from the Java code. Not only does this save time, but it would also implicitly turn into a kind of contract test between user interface and backend.

In the [backend](https://github.com/instana/backend/tree/develop/ui/typescript-generation) repository, we have added a script to generate typescript type definitions out of the java code and create a PR to `ui-client` every time there is a change detected in delivery branches.

Sample PR: https://github.com/instana/ui-client/pull/6779

This PR will update the `ui-client/in-types.d.ts` file.

More details about the type-def generation can be found in our [backend repo](https://github.com/instana/backend/tree/develop/ui/typescript-generation)

### Sample TS output from Java

### Java

```java
public class MyApplication {
  private final String foo;
  @NotNull
  private final String fooBar;
  @NotBlank
  private final String fooBarFizz;
  @Nullable
  private boolean isFooBarActive;
}
```

### Typescript output

```ts
export interface MyApplication {
  readonly foo?: string;
  readonly fooBar: string;
  readonly fooBarFizz: string;
  readonly isFooBarActive?: boolean;
}
```

### Example usage

```ts
import { Result, Progress } from 'in-types';

export const finishedProgress: Progress = Object.freeze({
  loading: false
});

export const pendingResult: Readonly<Result<any>> = Object.freeze({
  progress: indeterminateProgress,
  errors: Object.freeze([]) as []
});
```
