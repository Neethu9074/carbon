# TypeScript Usage in ui-client

**Warning:** The guidelines contained within this document are just proposals. We are still aligning these with the UI community of practice. As a consequence, please do not start to use TypeScript yet within this repository!

## Tooling

- The Webpack dev mode will check for type errors and present them within its dev output (see `/build/gulp/dev.js`).
- The TypeScript compiler is leveraged for type checking as part of the pre-commit hook and CI (see `/package.json`).
- We leverage eslint to lint TypeScript code (see `/.eslintrc.js`).
- Visual Studio Code linting and type checking works out of the box.

## Cheat Sheets

- https://github.com/typescript-cheatsheets/react
- https://react-typescript-cheatsheet.netlify.app/docs/basic/recommended/resources/

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

### Types vs. Interfaces

**State:** This is a non-validated proposal.

- https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces
- https://github.com/typescript-cheatsheets/react/blob/main/README.md#types-or-interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable. According to recommendations found on various sources, we want to try to go with interfaces first until we will hit a point where a type is unavoidable.
One example for choosing a type instead of an interface could be that one wants to combine multiple types, e.g. (type CommonMouseEvent : MouseEvent | React.MouseEvent). Using interfaces, one would need to create a new interface and extend from both.

### Enums

**State:** This is a non-validated proposal.

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

### Shared Typings

**State:** This is a non-validated proposal.

TODO where to put types?
TODO Where to put commonly used types? (timeConfig / tagFilter)

### Placement of Types

**State:** This is a non-validated proposal.

TODO where do types go for react components/files? (same file, next to it…)

### Backend Types

**State:** This is a non-validated proposal.

TODO type generation from backend

### Declaration for existing JavaScript files

**State:** This is a non-validated proposal.

TODO how and when do we wanna use declaration files in favor of translating a JS file to TS? (edited)

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
