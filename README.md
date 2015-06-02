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

?hostCount=x
```
for testing enviroment (creates x random hosts).

```
?singlemetrics
```
for testing enviroment (shows random metrics/host in 1sec update intervall).

```
?multimetrics
```
for testing enviroment (shows random metrics/host in 1sec update intervall).

```
?processes
```
for testing enviroment (creates x random processes/host).
looks shitty if used with metrices!

## Structure
The map is structured in:

scene has a map (physical/logical).
map has n zones.
zone has n hosts.
host has n processes.

## Filtering
Hosts can be filtered via: PhysicalMap.filter(validationFunction);

```
//filters the map and shows only all unknown hosts
map.filter((host) => {return host.isUnknown === true; });
```
