import { buildJsonSerializer, buildJsonParser, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { defaultType } from 'in-infrastructure/Explore/constants';

export const infraExplorePath = '/explore';

export const tagFilterExpressionMatrixParameter = {
  path: infraExplorePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupMatrixParameter = {
  path: infraExplorePath,
  name: 'group',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const chartsMatrixParameter = {
  path: infraExplorePath,
  name: 'charts',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyObject
};

export const typeMatrixParameter = {
  path: infraExplorePath,
  name: 'type',
  initialState: defaultType
};

export const metricsMatrixParameter = {
  path: infraExplorePath,
  name: 'metrics',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const resetMetricsOnTypeChange = {
  bind: [
    {
      path: infraExplorePath,
      name: 'type'
    }
  ],
  reset: { metrics: emptyArray }
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}

export function getLinkToExplore({ tagFilterExpression, group, charts, type }) {
  return getModifiedUrlStream(params => {
    params.pathname = infraExplorePath;

    if (tagFilterExpression) {
      setMatrixKey(params, tagFilterExpressionMatrixParameter, tagFilterExpression);
    }

    if (group) {
      setMatrixKey(params, groupMatrixParameter, group);
    }

    if (charts) {
      setMatrixKey(params, chartsMatrixParameter, charts);
    }

    if (type) {
      setMatrixKey(params, typeMatrixParameter, type);
    }
  });
}

function setMatrixKey(params, matrixParameter, value) {
  const serializer = matrixParameter.serializer || String;
  setOrDeleteMatrixKey(params, infraExplorePath, matrixParameter.name, serializer(value));
}
