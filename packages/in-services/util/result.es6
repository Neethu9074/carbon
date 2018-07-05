import { finishedProgress, emptyArray } from 'in-services/fixedObjects';

export function mapData(result, fn) {
  if (result.data != null) {
    return {
      ...result,
      data: fn(result.data)
    };
  }
  return result;
}

export function success(data, time = Date.now()) {
  return {
    data,
    errors: emptyArray,
    progress: finishedProgress,
    time
  };
}
