import CylinderCP from 'in-map/singleMeshFactories/ContentProvider/CylinderContentProvider';
import CloudCP from 'in-map/singleMeshFactories/ContentProvider/CloudContentProvider';
import EumCP from 'in-map/singleMeshFactories/ContentProvider/EumContentProvider';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import { BufferGeometry } from 'in-map/3DLibProvider';

export const simpleServiceGeometry = new BufferGeometry();
updateAttribute(simpleServiceGeometry, 'position', CylinderCP.getVertices());

export const externalServiceGeometry = new BufferGeometry();
updateAttribute(externalServiceGeometry, 'position', CloudCP.getVertices());

export const eumServiceGeometry = new BufferGeometry();
updateAttribute(eumServiceGeometry, 'position', EumCP.getVertices());
