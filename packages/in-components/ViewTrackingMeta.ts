/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import usePageTracker from 'in-services/tracking/segment/PageTracker';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { setMeta } from 'in-services/tracking/tracking';
import { emptyObject } from 'in-services/fixedObjects';

interface Props {
  data: any;
}
interface DynamicEventTrackerProps {
  productArea: string | null;
  pageRootName: string | null;
}

const useSideEffect = createSideEffectHook(
  (propsList: Props[]) =>
    propsList.reduce(
      (result, props) => ({
        ...result,
        ...props.data
      }),
      emptyObject
    ),
  setMeta
);

export default function ViewTrackingMeta({ data }: Props) {
  const { productArea, pageRootName } = data;
  usePageTracker({
    productArea,
    pageRootName
  });
  if (productArea && pageRootName) {
    setViewTrackingDataValues(productArea, pageRootName);
  }
  useSideEffect(data);
  return null;
}

const createDynamicEventTracker = () => {
  let dynamicEventTrackerProperties: DynamicEventTrackerProps = {
    productArea: null,
    pageRootName: null
  };
  const setViewTrackingDataValues = (productArea: string, pageRootName: string) => {
    dynamicEventTrackerProperties = { productArea, pageRootName };
  };

  const getViewTrackingMetaData = (): DynamicEventTrackerProps => {
    return dynamicEventTrackerProperties;
  };

  return { setViewTrackingDataValues, getViewTrackingMetaData };
};
export const { setViewTrackingDataValues, getViewTrackingMetaData } = createDynamicEventTracker();
