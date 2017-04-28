import { Line, BufferGeometry, LineBasicMaterial, Vector3 } from 'in-map/3DLibProvider';
import { updateAttribute } from 'in-map/services/geometryAttributes';
import { UP } from 'in-map/misc/fixedVectors';

const COLLISION_LINE_MATERIAL = new LineBasicMaterial({ color: 0xff00ff });

export function getManhattanPath(fromX, fromY, toX, toY) {
  const p0 = new Vector3(fromX, 0, fromY);
  const p4 = new Vector3(toX, 0, toY);

  if (toX > fromX) {
    toX -= 1;
  } else {
    toX += 1;
  }
  if (toY > fromY) {
    fromY += 1;
  } else {
    fromY -= 1;
  }

  const p1 = new Vector3(fromX, 0, fromY);
  const p2 = new Vector3(fromX + (toX - fromX), 0, fromY);
  const p3 = new Vector3(toX, 0, toY);

  return [p0, p1, p1, p2, p2, p3, p3, p4];
}

export function getNormalizedDirectionForPoints(a, b) {
  const dir = getDirectionForPoints(a, b);

  // normalize them
  const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
  dir.x /= length;
  dir.y /= length;
  dir.z /= length;

  return dir;
}

export function getDirectionForPoints(a, b) {
  a.z = a.z || 0;
  b.z = b.z || 0;
  return { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
}

export function shortenPathAtSourceAndDestination(path) {
  const pathLength = path.length;
  const first = path[0];
  const second = path[1];
  const beforeLast = path[pathLength - 2];
  const last = path[pathLength - 1];
  const dirFirstToSecond = getNormalizedDirectionForPoints(first, second);
  const dirlastToBeforeLast = getNormalizedDirectionForPoints(last, beforeLast);

  const dir = getDirectionForPoints(first, last);
  const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
  if (length <= 1) {
    return path;
  }

  // caps the first and last line of the connection. nodes have a size of 1 and
  // normally the connection goes from center (0.5, 0.5) to center. with this
  // capping it begins on the edge of the first and ends on the edge of the
  // last node. to get the right of the four possible we need the direction
  // directions are normalized so you can multiply with 0.5
  first.x += dirFirstToSecond.x * 0.5;
  first.y += dirFirstToSecond.y * 0.5;
  first.z += dirFirstToSecond.z * 0.5;

  last.x += dirlastToBeforeLast.x * 0.5;
  last.y += dirlastToBeforeLast.y * 0.5;
  last.z += dirlastToBeforeLast.z * 0.5;

  return path;
}

export function addArrowToDestination(path) {
  const from = path[path.length - 1];
  const to = path[path.length - 2];
  const arrowGeometry = getArrowGeometry(from, getNormalizedDirectionForPoints(from, to));

  const endOfPathArray = path.length;
  for (let i = 0; i < arrowGeometry.length; i++) {
    path[endOfPathArray + i] = arrowGeometry[i];
  }

  return path;
}

function getArrowGeometry(position, dir) {
  const arrowLength = 0.25;

  // because the arrow are laying on the ground, the up-vector is 0 1 0
  const right = UP.clone().cross(dir).multiplyScalar(arrowLength * 1.5); // shorten to get a angle < 45 degree
  const arrowLineX = (right.x + dir.x) * arrowLength;
  const arrowLineZ = (right.z + dir.z) * arrowLength;
  const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
  const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

  return [
    position,
    { x: position.x + arrowLineX, y: position.y, z: position.z + arrowLineZ },
    position,
    { x: position.x + arrowLineXLeft, y: position.y, z: position.z + arrowLineZLeft }
  ];
}

export function flatten(path) {
  const flattenedPath = [];
  for (let i = 0, length = path.length; i < length; i++) {
    const indexInPathArray = i * 3;
    const position = path[i];
    flattenedPath[indexInPathArray] = position.x;
    flattenedPath[indexInPathArray + 1] = position.y;
    flattenedPath[indexInPathArray + 2] = position.z;
  }
  return flattenedPath;
}

export function getCenterPosition(from, to) {
  return {
    x: from.x + (to.x - from.x) * 0.5,
    y: from.y + (to.y - from.y) * 0.5,
    z: from.z + (to.z - from.z) * 0.5
  };
}

export function updateLogicalCollisionMesh(collisionLine, from, to) {
  updateAttribute(collisionLine.geometry, 'position', [from.x, from.y, from.z, to.x, to.y, to.z]);
}

export function logicalCollisionMesh() {
  const geometry = new BufferGeometry();
  const line = new Line(geometry, COLLISION_LINE_MATERIAL);
  line.frustumCulled = false;
  return line;
}

export function physicalCollisionMesh() {
  const geometry = new BufferGeometry();
  const line = new Line(geometry, COLLISION_LINE_MATERIAL);
  line.frustumCulled = false;
  return line;
}

export function updatePhysicalCollisionMesh(collisionLine, from, to) {
  const vertices = flatten(getManhattanPath(from.x, from.z, to.x, to.z));
  updateAttribute(collisionLine.geometry, 'position', vertices);
}

export function intersects(raycaster, collisionLine) {
  if (!collisionLine) {
    return false;
  }

  raycaster.linePrecision = 0.25;
  const hit = raycaster.intersectObject(collisionLine, false);
  for (let i = 0, length = hit.length; i < length; i++) {
    if (hit[i].distance >= 0) {
      return true;
    }
  }
  return false;
}

export function getOffsetVectors(from, to) {
  const direction = new Vector3(to.x - from.x, 0, to.z - from.z).normalize();
  const forward = direction.clone().multiplyScalar(0.075);
  const right = direction.cross(UP).multiplyScalar(0.25);

  return {
    right,
    forward
  };
}
