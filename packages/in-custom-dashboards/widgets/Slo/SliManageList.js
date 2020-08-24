import React, { useState } from 'react';
import { get } from 'lodash';

import { getSliConfigurations, deleteSliConfiguration } from 'in-custom-dashboards/api';
import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import CreateNewSLIForm from 'in-custom-dashboards/widgets/Slo/CreateSLIForm';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import getApplication from 'in-subscription/application/getApplication';
import SliList from 'in-custom-dashboards/widgets/Slo/SliList';
import { isLoading, hasError } from 'in-services/util/result';
import LightCardV2 from 'in-new-components/Card/LightCardV2';
import KeyValue from 'in-new-components/lists/KeyValue';
import { alwaysNull } from 'in-services/fixedStreams';
import WithIcon from 'in-new-components/WithIcon';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import theme from 'in-themes';

import locals from './SliManageList.mless';

const DEFAULT_API = {
  getSliConfigurations
};

export default function SliManageList({ api = DEFAULT_API, applicationId, apName }) {
  const [sliSelected, selectSli] = useState(null);
  const queryState = useState('');
  const createSliHeader = (
    <Button kind="action" onClick={() => selectSli({})} icon="lib_openclose_add">
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
      slideInContentTitle={'SLI List'}
      slideInContent={
        <div
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
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
                    <Tooltip content="View/Clone SLI Configuration">
                      <SvgIcon type="lib_actions_edit" color={'rgb(0,152,232)'} onClick={() => selectSli(item)} />
                    </Tooltip>
                  );
                }
              },
              {
                sortable: false,
                width: '2rem',
                getContent(item) {
                  return (
                    <Tooltip content="Delete SLI Configuration">
                      <SvgIcon
                        type="lib_actions_delete"
                        color={'rgb(0,152,232)'}
                        onClick={() =>
                          deleteSliConfiguration(item.id).subscribe(result => {
                            if (result.progress.loading) {
                              return;
                            }
                            if (result.errors.length > 0) {
                              addMessage(
                                {
                                  type: 'danger',
                                  timeout: 3000,
                                  content: 'Failed to delete the sli.'
                                },
                                'custom-dashboard-error'
                              );
                            } else {
                              addMessage(
                                {
                                  type: 'info',
                                  timeout: 2000,
                                  content: 'SLI configuration was successfully deleted.'
                                },
                                'custom-dashboard-info'
                              );
                            }
                          })
                        }
                      />
                    </Tooltip>
                  );
                }
              }
            ]}
            getItems={() => api.getSliConfigurations()?.map(onlyWithAPid(applicationId)) ?? null}
            rightHeader={createSliHeader}
            query={queryState}
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
    id: 'name',
    sortable: false,
    label: 'Name',
    getContent(item) {
      return (
        <WithIcon iconColor={theme.lib.colors.N500} icon={getIcon(item)} className={locals.withIcon}>
          {getSliNameWithSubscript(item)}
        </WithIcon>
      );
    }
  },
  {
    id: 'metric',
    sortable: false,
    label: 'SLI Type',
    getContent(item) {
      const metric = metricConfiguration => {
        if (metricConfiguration) {
          return `${metricConfiguration.metricName} (${metricConfiguration.metricAggregation})`;
        }
        return valueMissingPlaceholder;
      };
      const value = item => {
        if (item?.sliEntity?.sliType === 'application') {
          return 'Time-based, ' + (item?.metricConfiguration && metric(item.metricConfiguration));
        }
        return 'Event-based';
      };
      return (item && value(item)) ?? valueMissingPlaceholder;
    }
  }
];

function getIcon(item) {
  if (item?.sliEntity?.endpointId) {
    return 'lib_application_endpoint';
  } else if (item?.sliEntity?.serviceId) {
    return 'lib_application_service';
  }
  return 'lib_application';
}

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getSliNameWithSubscript(item) {
  return (
    <Labels
      sliName={item.sliName}
      applicationId={item?.sliEntity?.applicationId}
      serviceId={item?.sliEntity?.serviceId}
      endpointId={item?.sliEntity?.endpointId}
    />
  );
}

const Labels = connectTo(
  props => {
    return {
      applicationLabel: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : alwaysNull,
      serviceLabel: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : alwaysNull,
      endpointLabel: props.endpointId ? getEndpointInfo({ id: props.endpointId }).map(getLabel) : alwaysNull
    };
  },
  function Labels({ ...props }) {
    let subscript = '';
    if (props.applicationLabel) {
      subscript = subscript + props.applicationLabel;
    }
    if (props.serviceLabel) {
      subscript = subscript + ' > ' + props.serviceLabel;
    }
    if (props.endpointLabel) {
      subscript = subscript + ' > ' + props.endpointLabel;
    }
    return <KeyValue label={subscript} value={props.sliName} />;
  }
);
