import TCP from 'in-map/singleMeshFactories/ContentProvider/TraceContentProvider';
import { BufferAttribute, BufferGeometry } from 'in-map/3DLibProvider';

export default function TraceBufferGeometry() {
  BufferGeometry.call(this);

  const vertices = new Float32Array(TCP.getVertices());
  const size = 0.0025;
  for (let i = 0; i < vertices.length; i++) {
    vertices[i] *= size;
  }
  this.addAttribute('position', new BufferAttribute(vertices, 3));
}

TraceBufferGeometry.prototype = Object.create(BufferGeometry.prototype);
TraceBufferGeometry.prototype.constructor = TraceBufferGeometry;
