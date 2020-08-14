import React, { useState } from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import { formatDateTime } from 'in-services/formatters/date';
import KeyValue from 'in-new-components/lists/KeyValue';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';

const DEFAULT_API = {
  getSliConfigurations
};

export default function SliManageList({ api = DEFAULT_API, applicationId, apName }) {
  const [showInnerDialog, setShowInnerDialog] = useState(true);

  const createSliHeader = (
    <Button kind="action" onClick={() => setShowInnerDialog(true)} icon="lib_openclose_add">
      Create SLI
    </Button>
  );

  return (
    <SlideInView
      onShowSlideInContentChange={setShowInnerDialog}
      showSlideInContent={showInnerDialog}
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={250}
      slideInContentTitle={'Back to SLIs️'}
      slideInContent={
        <div
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          {<Button onClick={() => setShowInnerDialog(false)}>Back to List of SLIs</Button>}
          <CreateNewSLIForm
            sliConfig={{
              sliName: 'robert-create-a-new-sli',
              metricConfiguration: {
                metricName: 'latency',
                metricAggregation: 'P90',
                threshold: 10
              },
              sliEntity: {
                sliType: 'application',
                applicationId: 'acfRC1IqTVi41OMLAJU4Cw',
                serviceId: null,
                endpointId: null,
                boundaryScope: 'ALL'
              }
            }}
          />
        </div>
      }
      staticContent={
        <div>
          <SliList
            columnDefinitions={columnDefinitions}
            getItems={() => api.getSliConfigurations()?.map(onlyWithAPid(applicationId)) ?? null}
            rightHeader={createSliHeader}
          />
        </div>
      }
      enforceMaxHeightForStaticContent
    />
  );
}

const onlyWithAPid = applicationId => {
  return sliConfigs => {
    if (isLoading(sliConfigs) || hasError(sliConfigs)) {
      return sliConfigs;
    }

    return {
      ...sliConfigs,
      data: {
        items: sliConfigs?.data?.filter(sli => sli?.sliEntity?.applicationId === applicationId) ?? []
      }
    };
  };
};

const columnDefinitions = [
  {
    sortable: false,
    width: '3rem',
    getContent() {
      return <SvgIcon type="lib_application" />;
    }
  },
  {
    sortable: false,
    label: 'Name',
    getContent(item) {
      if (item?.apConfigName) {
        return <KeyValue label={`${item?.apConfigName}`} value={item?.sliName} accentuated />;
      }
      return <KeyValue value={item?.sliName} accentuated />;
    }
  },
  {
    sortable: false,
    label: 'Metric',
    getContent(item) {
      const metric = metricConfiguration => {
        if (metricConfiguration) {
          return `${metricConfiguration.metricName} (${metricConfiguration.metricAggregation})`;
        }
        return valueMissingPlaceholder;
      };
      return (item?.metricConfiguration && metric(item.metricConfiguration)) ?? valueMissingPlaceholder;
    }
  },
  {
    sortable: false,
    label: 'First evaluation',
    getContent(item) {
      const timestamp = item?.initialEvaluationTimestamp;
      return timestamp ? (
        <time dateTime={new Date(timestamp).toISOString()}>{formatDateTime(timestamp)}</time>
      ) : (
        <span>{valueMissingPlaceholder}</span>
      );
    }
  },
  {
    sortable: false,
    width: '2rem',
    getContent() {
      return (
        <Tooltip content="View/Clone SLI, will come soon">
          <SvgIcon type="lib_actions_edit" color={'primary'} />
        </Tooltip>
      );
    }
  }
];
