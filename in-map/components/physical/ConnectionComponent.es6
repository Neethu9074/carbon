import sceneObjectComponent from 'in-map/components/SceneObjectComponent';
import Connection from 'in-map/sceneObjects/physical/Connection';


export default sceneObjectComponent(props => {
  return {
    InstanceType: Connection,
    params: {
      id: props.entity.get('id'),
      entity: props.entity,
      sourceNode: props.sourceNode,
      destinationNode: props.destinationNode
    }
  };
}, ConnectionComponent
);

function ConnectionComponent() {
  return (
    null
  );
}
