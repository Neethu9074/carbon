import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import NodeMetric from 'in-map/sceneObjects/physical/NodeMetric';


export default sceneObjectComponent(props => {
  return {
    InstanceType: NodeMetric,
    params: {
      id: props.node.id + '_metric',
      dashboardId: props.node.id,
      node: props.node
    }
  };
}, NodeMetricComponent );

function NodeMetricComponent({}) {
  return null;
}
