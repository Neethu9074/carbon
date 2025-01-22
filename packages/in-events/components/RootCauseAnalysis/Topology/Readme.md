## The general flow of how the topology is created

To begin we'll go over what happens from the moment the user presses the view topology button to the point where the topology is displayed and able to be interacted with.

### The user presses view topology

Upon doing this the rendering of the dialog component `RootCauseTopologyDialog` begins where we send the related AP information, triggering event, time config and finally all the root causes in the format of an array like so:

`[<SnapshotID, ProbableCauseType>]` where ProbableCauseType is as follows:

```js
{
  entityID: Map<string, string>;
  explainability: List<Map<ExplainabilityKeys, ExplainabilityValues[ExplainabilityKeys]>>;
  probFailure: number;
  events: List<string>;
  snapshotId?: string;
}
```

With this we can begin making requests for information inside RootCauseTopologyDialog to get all the necessary information to begin creating nodes and links for our topology.

### RootCauseTopologyDialog begins making requests for snapshot and stack data for entity

The first thing that happens is that we utilize the `useFetchAppropriateRCAEntityData` hook that we normally use for RCA to gather some data of interest such as snapshot information, stack data and service information for each of the root cause entities that we send over to the `RootCauseTopologyDialog` as well as the triggering entity. Generally the data that comes back is in the following format:

```js
{
  entityData: SnapshotData | null;
  entityType: string; // is 'infrastructure', 'endpoint', 'service', 'application'
  hierarchySnapshots: SnapshotData[] | null | undefined; // used for infrastructure to get the hierarchy
  entityStackData: any; // getStackforInfrastructure or getStackforEndpoint or getStackforService or getStackforApplication
  infraServiceLabelInformation: ServiceLabel[]; // For infra entities all the services associated to that infra entity
  nonInfraServiceLabelInformation: ServiceLabel | null; // For AP entities the service associated to that AP entity
  loadingStackData: boolean; // loading indicator for getting stack data
  loadingSnapshotData: boolean; // loading indicator for getting snapshot data
}
```

Once we have all this data we can make requests for requests for service information.


### RootCauseTopologyDialog begins making requests for service information

Using the `getServiceMap` WS query we make requests for service map information relating to our triggering entity or root causes and application information. At the moment since we know all these entities will exist under the same AP we can make an assumption here that we can use either a triggering entity or any rca entity as a filter for our service map call.

Once we make this requests we get a response of all relevant services and their connections in the following format

```js
ServiceMap {
  connections: ServiceMapConnection[],
  services: ExtendedService[]
}
```

where `ServiceMapConnection` indicates information between services like from (which service), to (which service), errorRate and latency.

This gives us a starting point to begin making our service --> service connections (non-familial). Once we have all of this information we can begin manipulating it to create a basic relationship map containing nodes and links.


### RootCauseTopologyDialog begins filtering and manipulating data to create a nodes and relationships map

#### Filter service to service connections

The first step here is to map all relevant service to service connections. We essentially take our output from the getServiceMap call and only filter for services that contain our RCA or triggering entity as to not show any irrelevant services.

- We filter out and connections that do not contain services we don't care about
- We filter out the services that we do not care about

#### Nodes map construction

Next, we construct our preliminary nodes map by taking in our filtered service to service connections, RCA(s) and triggering entity with its services and create a node map. The format of each node in the node map is as follows:

```js
{
  id: string;
  label: string;
  data: any;
  specialCaseVisibility: boolean;
  tags: Set<RCA_TOPOLOGY_TAGS>;
  entityType: RCA_TOPOLOGY_ENTITY_TYPE_TAGS;
  [index: string]: any;
}
```

The `id` and `label` fields are self explanatory, the data is just the snapshot data we get from our `useFetchAppropriateRCAEntityData` call, special case visibility is something that is for visual filtering (essentially to display RCA entities as purple), and finally tags are used to tag nodes that are RCA entities or triggering entities and what type of entity they are.

We pretty much go through all the RCA entities and add to this node map the RCA entity itself along with all relevant services as well, if it is an infra entity, any familial entities that are relevant. Then we do the same thing for the triggering entity and its services.

In the case that an RCA entity or Triggering entity does not have any service information then we add an "unspecified service" node as well.

Once this is complete we should have a node map constructed of all entities.

### Connections Map construction

Next, we construct a preliminary connections map indicating all connections between each node on the topology. We take in the filtered service to service connections, RCA(s), triggering entity and its services and finally the preliminary constructed nodes map to begin making our connections map.

The connections map will have the following data:

```js
{
  from: string, // ID
  to: string, // ID
  connectionType: 'outgoing', // Can be 'outgoing' or 'family' or 'physical'
  metrics: { latency: serviceIDs.latency, errorRate: serviceIDs.errorRate } // relevant for service to service connections
}
```

There's a few connection types and they correspond as follows:

**outgoing**
- Representative of service to service connections or non-familial/physical connections

**family**
- These are logical connections between AP entities like service to endpoint or AP to service

**physical**
- These are physical connections between infra entities like host to process

We start with the service to service connections from our `getServiceMap` call and tag them all as 'outgoing' connections since it pretty much uses the same format sans connectionType which is something created by me.

Then we iterate through each root cause and create the familial connections that go from service to the RCA entity to the physical connections for the RCA entity if they are there OR from the RCA entity to service in the case that the RCA entity is somehow identifies as an AP (or more relevant when the triggering entity can be an AP later). Finally if our RCA entity is infrastructure then we add the physical connections based on the hierarchy snapshots from the `useFetchAppropriateRCAEntityData`.

We repeat the above process for the triggering entity and its service.

Finally we filter out any connections that contain node IDs that do not exist in our node map that we created in the previous step. This can happen when we take our baseline as the `getServiceMap` output.

In some instances we can create connections where a node can be connected to itself which also gets filtered out. This was seen in the output of `getServiceMap` as well.

Finally we should have a constructed connections map that we will do some additional filtering to in the next step

### Filter connections and nodes map for special cases based on testing

So in this final function in the RootCauseTopologyDialog we want to handle some special cases that have arisen during testing.

**Unspecified service case**

- In this case we may have not created a connection between the AP and the unspecified service so we need to add this connection
- Occurs when we add the unspecified service ourselves in the node creation step

**No AP in topology**

- If the topology does not contain an AP which occurs when the triggering entity or RCA is not an AP then we create a node for the topology and hook up all services to it
- Necessary so we don't have disconnected nodes on the topology because there are cases where a TE can be identified that is sitting on a service that does not have a service to service connection with all the other RCA services

**The super service**

- If we have an infra entity that has a ton of services we want to condense this down so we don't have a crazy huge topology w/ a ton of unnecessary services
- As such we combine them all under one node indicating how many services there are and call it a super service
- The super service will only exist if the only connection is to the RCA/TE entity itself
- Then we delete the service nodes from the topology
- These can be effectively seen as irrelevant services

**Deleting service to RCA/triggering entity connections in the case the RCA/triggering entity is infra and not at the top of the physical hierarchy**

- Due to how we construct our connections it can be that we have our RCA/triggering entity far down a physical hierarchy list but still have a service connection
- While its not inaccurate it just doesn't fit the flow of the topology graph well so we filter out this connection

**Remove nodes without relationships and services without a connection beyond the AP**

- Nodes without relationships will mess up the graph so we remove them
- Services that don't have connections beyond the AP (unless its triggering or RCA) should be removed as they are wholly irrelevant

==

Finally we should have a finalized version of our connections and node map that we will use to display in the graph. We send all the relationships and nodes to a component called `RootCauseTopology`

### RootCauseTopology creates links and nodes for the Elk JS library

The Elk JS library has a specific format for nodes and connections that is very akin to the ones that I created above. Nodes have the following format:

```js
GraphNode {
  id: node.id,
  entityType: 'application' | 'service' | 'endpoint' | 'infrastructure' | 'superService',
  metadata: { ...node.data },
  height: 48,
  width: 48,
  label: string,
  tags: Set<RCA_TOPOLOGY_TAGS>
}
```

Links have the following format:

```js
GraphLink {
  sources: [relationship.from], // equivalent to from
  targets: [relationship.to], // equivalent to to
  id: string,
  dashed: relationship.connectionType === 'outgoing', // if link is dashed or not
  labels: relationship.label ? [{ text: relationship.label }] : undefined, // label if necessary
  layoutOptions: relationship.connectionType === 'outgoing' ? { 'elk.layered.priority': 0 } : undefined // used to separate outgoing connections from familial connection
}
```

The conversion is easily done between my connections and nodes map to this format. Finally we send these nodes and links down to the `RootCauseTopologyPresenter`.

### The RootCauseTopologyPresenter renders nodes and links

Using the Elk JS library we take the above links and nodes along with a layered algorithm and create our nodes and links on an SVG canvas. Each node will make calls for health information separately for each entity to appropriately display health information on the topology.

## Files and their use cases

### packages/in-events/components/RootCauseAnalysis/Topology/RootCauseLegend.tsx

This renders the legend you see on the graph

packages/in-events/components/RootCauseAnalysis/Topology/RootCauseTopologySVGWrapper.tsx

This renders the svg canvas along with controls for the canvas like zooming in and out

### packages/in-events/components/RootCauseAnalysis/Topology/RootCauseTopology.tsx

This renders the the topology as well converts our nodes and connections map to ones appropriate for ELK JS

### packages/in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog.tsx

This is what does all the job of making sure we collect all the information on all nodes and relationships and compiles them into a succinct map that gets sent to the topology.

### packages/in-events/components/legacy/TopologyUtils.ts

This contains a ton of helper functions mostly for building our nodes and connections map in RootCauseTopologyDialog.
