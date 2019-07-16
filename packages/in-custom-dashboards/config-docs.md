# Custom dashboard configuration docs

Take a look at `in-custom-dashboards/proposed-config.js` to see valid configuration.

## Essential fields for custom dashboard configuration
```javascript
{
  id: // used as identifier for layout configuration
  title: // main heading of the dashboard
  panels: [] // list of all elements and their configurations that are present inside the dashboard
  layout: []
}
```

## Available components and their configurations:

### Chart
```javascript
{
  id:
  panelType: 'chart',
  title: // chart heading
  searchQuery: // used to fetch data for chart, eg. 'entity.host.name:"loadbalancer-eum-*"'
  restrictResultEntityType: // in combination with previeous field completes data retrieval
  pluginIdForMetrics: 'nginx'
  y1: {
    metrics: ['requests'] // one metric if the search query returs multiple snapshotIds, array of multiple if result is single snapshot
    labels: {
      template: '{{ takeFirst($.host.label, 3, -) }}' // take a look below for explanation
    }
    format: 'number.perSecond.compact', // format for the data in the chart
    type: 'stackedArea' // type of chart eg. stackedArea, line ...
  }
  // can include optional y2 axis, with the same structure as y1
}
```

_note:_ object above could use optional `y2` axis that shares same config as neccessary `y1`.

#### Chart custom label configuration rules
Custom labels are achieved by using templating engine behind the scenes. The `$` represents object that contains retrieved data for specific `snapshotId`. Depending on the result type `$` can have different properties on itself.

We use mustasche syntax to allow for dinamyc data. Everything in between `{{ }}` is going to be evaluated by our engine and be replaced with dynamic data.

There're 2 custom data formatting functions that could be used inside `{{ }}`:

**truncate:**


@param num Number of characters used to truncate the given string

syntax: `{{ truncate(custom variable, num) }}`
eg. `{{ truncate(Hello World, 4) }}` _resolves to Hell_

**takeFirst:**

Takes first N partials separated by special character

@param  num Number of partials taken from string

@param separator Character used to separate the given string (must not be wrapped in quotation marks)

syntax: `{{ takeFirst(custom variable, num, separator) }}`
eg. `{{ takeFirst(Instana-says-Hello-World, 3, -) }}` _resolves to Instana-says-Hello_

### Table

```javascript
{
  id: // used as identifier for layout configuration
  panelType: 'table'
  maxItemsPerPage: // used for pagonation
  searchQuery: // used to fetch data for tables eg. 'entity.host.name:"loadbalancer-eum-*"'
  restrictResultEntityType: // used in combination with searchQuery to limit results  eg. 'nginx'

  columns: [
    {
          title: // column title
          type: // column type eg. 'snapshotLink', 'metric'
          typeArgs: {
            snapshotIdLocation:
            metric: // eg. cpu.user, cpu.sys
            timeWindowAggregation: 'mean'
          }
    },
  ], //
  rowDetails: [
    pluginIdForMetrics:
    labels: [...] // eg. ['User', 'System', 'Wait', 'Nice', 'Steal']
    metrics: [...] // eg. ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal']
    format: // data formatter
    type: // chart type
  ] // array of chart configurations the get rendered once row is expanded
}
```

Currently custom table support is limited and we do not support:
- 2 axis on single chart
- grid style laypout for charts when row is expanded

## Lists

Renders tree-like list of links with support for indefinite nesting of links.

```javascript
{
  id:
  panelType: 'list'
  title:
  items: [
    {
      label: // title of sublist
      description: // description for sublist
      items: [<ListItem>] // sublist items
    }
  ]
}
```

where `ListItem` is actually:

leaf:
```javascript
{
  label: // link label
  href:  // link destination
  description: // link description
}
```

sublist:
```javascript
{
  label: // sublist title
  description: // sublist description
  items: [<ListItem>]
}
```

Each of the links is external.

### Section Header
```javascript
{
  panelType: 'section-title'
  id: // used to keep track of element positions in Grid
  title:
}
```
