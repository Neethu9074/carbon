# ui-map

The current version of the visualization is always available via our [Jenkins](http://52.6.5.25/).

## Setup

```
npm install
npm run dev
```

Take `.npmrc.sample` and copy it to `.npmrc`, configure it your nexus account name/password.

Nginx proxy used in development, shall can be adjusted/configured in `proxrox.yaml`

### Usage

The ui-map is developed as a react component so you can use it via:

```javascript
import Map from './path_where_index.es6_lies';

React.render(
  <Map onClick={onClick}/>,
  document.getElementById('map') //dom element to be attached to
);
```

## URL params
You can call the map with the params:
```
?stats
```
which enables render statistics.

```

## Structure
The map is structured in:

scene has a map (physical/logical).
map has n groups.
group has n nodes.
node has n layer.

# Factories
AbstractMeshCreationFactory //basic methods like add/removing fragments and creating a geometry
  - MeshFactory //building a geometry with position and color / vertex
    - CubeFactory //defining cubes as vertices and health as color
      - LayerFactory //cubes with alternating colors
      - NodeFactory //cubes can be grayed and support method for changing single colors
    - PlaneFactory //creates planar geometry
    - MultiMetricPillarFactory //creates cubes with multiple layer and animating height/layer
    - SingleMetricPillarFactory //creates cubes with animating height
  - LineFactory //creates lines as a single geometry

## Filtering
Nodes can be filtered via: PhysicalMap.filter(validationFunction);

```
//filters the map and shows only all unknown nodes
map.filter(node => node.isUnknown);
```
