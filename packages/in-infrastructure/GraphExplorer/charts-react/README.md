# charts-react

The code in this directory is imported from [carbon-charts](https://github.com/carbon-design-system/carbon-charts/tree/master/packages/react/src/diagrams) because we do not want to pull in this dependency in `ui-client`, and adding this dependency in `ui-foudation` is in-progress.
Since only `Edge` and `ShapeNode` were used here, they were copied over.
The styles were also copied over, but restricted to namespaces `edge` and `shape-node`
To transition back to `carbon-charts`, we would simply need to change the import

```ts
import { ShapeNode, Edge } from 'in-infrastructure/GraphExplorer/charts-react';
```

to

```ts
import { ShapeNode, Edge } from '@carbon/charts-react';
```

and

```ts
import 'in-infrastructure/GraphExplorer/charts-react/styles.css';
```

to

```ts
import '@carbon/charts/styles.css';
```

and remove this directory altogether.
