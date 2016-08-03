import {UP} from 'in-map/misc/fixedVectors';


export function getManhattanPath(fromX, fromY, toX, toY) {
  const p0 = { x: fromX, y: 0, z: fromY };
  const p4 = { x: toX, y: 0, z: toY };

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

  const p1 = { x: fromX, y: 0, z: fromY };
  const p2 = { x: fromX + (toX - fromX), y: 0, z: fromY };
  const p3 = { x: toX, y: 0, z: toY };

  return [p0, p1, p1, p2, p2, p3, p3, p4];
}

export function getDirectionForPoints(a, b) {
  a.z = a.z || 0;
  b.z = b.z || 0;
  const dir = {x: b.x - a.x, y: b.y - a.y, z: b.z - a.z};

  // normalize them
  const length = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
  dir.x /= (length);
  dir.y /= (length);
  dir.z /= (length);

  return dir;
}

export function shortenPathAtSourceAndDestination(path) {
  const pathLength = path.length;
  const first = path[0];
  const second = path[1];
  const beforeLast = path[pathLength - 2];
  const last = path[pathLength - 1];
  const dirFirstToSecond = getDirectionForPoints(first, second);
  const dirlastToBeforeLast = getDirectionForPoints(last, beforeLast);

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
  const from = path.length - 1;
  const to = path.length - 2;

  const arrowGeometry = getArrowGeometry(path[from], getDirectionForPoints(path[from], path[to]));

  for (let i = 0; i < arrowGeometry.length; i++) {
    path.push(arrowGeometry[i]);
  }

  return path;
}

function getArrowGeometry(position, dir) {
  const arrowLength = 0.25;

  // because the arrow are laying on the ground, the up-vector is 0 1 0
  const right = UP.clone()
                  .cross(dir)
                  .multiplyScalar(arrowLength * 1.5); // shorten to get a angle < 45 degree
  const arrowLineX = (right.x + dir.x) * arrowLength;
  const arrowLineZ = (right.z + dir.z) * arrowLength;
  const arrowLineXLeft = (-right.x + dir.x) * arrowLength;
  const arrowLineZLeft = (-right.z + dir.z) * arrowLength;

  return [
    position,
    {x: position.x + arrowLineX, y: position.y, z: position.z + arrowLineZ},
    position,
    {x: position.x + arrowLineXLeft, y: position.y, z: position.z + arrowLineZLeft}
  ];
}

export function flatten(path) {
  const flattenedPath = [];
  for (let i = 0, length = path.length; i < length; i++) {
    const position = path[i];
    flattenedPath.push(position.x, position.y, position.z);
  }
  return flattenedPath;
}

export function getCenterPosition(fromPos, toPos) {
  const from = fromPos.clone();
  const to = toPos.clone();
  return from.add(to.sub(from).multiplyScalar(0.5));
}
