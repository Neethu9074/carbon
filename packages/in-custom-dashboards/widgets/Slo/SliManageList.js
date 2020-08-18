import React, { useState } from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';
import { getSliConfigurations } from 'in-custom-dashboards/api';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import { formatDateTime } from 'in-services/formatters/date';
import KeyValue from 'in-new-components/lists/KeyValue';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

const DEFAULT_API = {
  getSliConfigurations
};

export default function SliManageList({ api = DEFAULT_API, applicationId, apName }) {
  const [sliSelected, selectSli] = useState(null);
  const sliConfig_example = {
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
  };

  const createSliHeader = (
    <Button kind="action" onClick={() => selectSli(sliConfig_example)} icon="lib_openclose_add">
      Create SLI
    </Button>
  );
  const close = () => selectSli(null);

  return (
    <SlideInView
      onShowSlideInContentChange={close}
      showSlideInContent={sliSelected}
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={500}
      slideInContentTitle={'Back to SLIs️'}
      slideInContent={
        <div
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          {<Button onClick={() => selectSli(null)}>Back to List of SLIs</Button>}
          {sliSelected && (
            <LightCardV2>
              <CreateNewSLIForm apName={apName} sliConfig={sliSelected} applicationId={applicationId} close={close} />
            </LightCardV2>
          )}
        </div>
      }
      staticContent={
        <div>
          <SliList
            columnDefinitions={[
              ...columnDefinitions,
              {
                sortable: false,
                width: '2rem',
                getContent(item) {
                  return (
                    <Tooltip content="View/Clone SLI">
                      <SvgIcon type="lib_actions_edit" color={'rgb(0,152,232)'} onClick={() => selectSli(item)} />
                    </Tooltip>
                  );
                }
              }
            ]}
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
  }
];
