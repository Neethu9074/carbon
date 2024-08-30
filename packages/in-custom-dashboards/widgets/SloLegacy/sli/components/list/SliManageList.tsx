/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { Message, Button } from '@instana/components';
import { OrderDirection } from '@instana/types';

import useFilteredAndSortedSliConfigurations from 'in-custom-dashboards/widgets/SloLegacy/hooks/useFilteredAndSortedSliConfigurations';
import {
  SLI_MANAGEMENT_CREATE_START,
  SLI_MANAGEMENT_DELETE,
  SLI_MANAGEMENT_EDIT_START
} from 'in-services/tracking/eventNames';
import CreateSliFormFactory from 'in-custom-dashboards/widgets/SloLegacy/sli/components/create/CreateSliFormFactory';
import { SliConfigBySliType, SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { useSlideOutDelay } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useSlideOutDelay';
import SliList from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliList';
import { deleteSliConfiguration } from 'in-custom-dashboards/widgets/SloLegacy/sli/api';
import SlideInView, { NoHeader } from 'in-components/SlideInView/SlideInView';
import { useSloTrackers } from 'in-service-levels/hooks/SloTrackerProvider';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/SliManageList.mless';

interface SliManageListProps<S extends SliType> extends SliManageListContentProps<S> {
  showCreateForm?: boolean;
  onCloseCreateForm: VoidFunction;
}

interface SliManageListContentProps<S extends SliType> {
  entityType: S;
  entityId: string;
  onChange: (sli?: Partial<SliConfigBySliType<S>>) => void;
  onShowCreateForm: (isEditing: boolean) => void;
}

interface InternalContentProps<S extends SliType> {
  setSliConfigToEdit: React.Dispatch<React.SetStateAction<Partial<SliConfigBySliType<S>>>>;
}

export default function SliManageList<S extends SliType>({
  entityType,
  entityId,
  onChange,
  showCreateForm,
  onShowCreateForm,
  onCloseCreateForm
}: SliManageListProps<S>) {
  const [sliConfigToEdit, setSliConfigToEdit] = useState<Partial<SliConfigBySliType<S>>>({});
  const transitionDelay = 500;
  const [isCreateFormVisible, hideCreateForm] = useSlideOutDelay(showCreateForm, transitionDelay);
  const onShowSlideInContentChange = () => onChange(undefined);

  return (
    <SlideInView
      onShowSlideInContentChange={onShowSlideInContentChange}
      showSlideInContent={showCreateForm}
      HeaderComponent={NoHeader}
      slideTransitionDurationMillis={transitionDelay}
      slideInContentTitle={t('in-custom-dashboards:widgets.slo.sliManageList.sliList')}
      renderSlideInContent={setFooter => {
        // Hide the form if the slide is out to not have the scroll-shadow visible afterwards
        if (!isCreateFormVisible) return <></>;

        return (
          <div className={locals.formWrapper}>
            <CreateSliFormFactory<S>
              entityType={entityType}
              entityId={entityId}
              close={onCloseCreateForm}
              setFooter={setFooter}
              sliConfig={sliConfigToEdit}
              onSave={onChange}
            />
          </div>
        );
      }}
      staticContent={
        <SliManageListContent
          entityId={entityId}
          entityType={entityType}
          onChange={onChange}
          onShowCreateForm={onShowCreateForm}
          setSliConfigToEdit={setSliConfigToEdit}
        />
      }
      enforceMaxHeightForStaticContent
      onAfterSlideOut={hideCreateForm}
    />
  );
}

function SliManageListContent<S extends SliType>({
  entityType,
  entityId,
  onChange,
  setSliConfigToEdit,
  onShowCreateForm
}: SliManageListContentProps<S> & InternalContentProps<S>) {
  const [nameQuery, setNameQuery] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('ASC');
  const sliResult = useFilteredAndSortedSliConfigurations(entityType, entityId, nameQuery, orderBy, orderDirection);
  const track = useSloTrackers();

  const onCreateConfig = () => {
    track(SLI_MANAGEMENT_CREATE_START, {
      entityType
    });
    setSliConfigToEdit({});
    onShowCreateForm(false);
  };
  const onEditConfig = (config: SliConfigBySliType<S>) => {
    track(SLI_MANAGEMENT_EDIT_START, {
      entityType
    });
    setSliConfigToEdit({ ...config, sliName: t('in-custom-dashboards:editor.copyOf', { title: config.sliName }) });
    onShowCreateForm(true);
  };
  const onDeleteConfig = (id: string) => {
    track(SLI_MANAGEMENT_DELETE, {
      entityType
    });
    deleteSliConfiguration(id).once(onDeleteSuccess, onDeleteFailed);
  };

  return (
    <div>
      {!role?.canConfigureServiceLevelIndicators && (
        <Message className={locals.message} withIcon>
          <Trans
            i18nKey="in-custom-dashboards:widgets.slo.sliManageList.configSrvLevelIndicatorsMsg"
            components={{ italic: <i />, bold: <strong /> }}
          />
        </Message>
      )}
      <SliList
        fetchedConfigState={sliResult}
        onChange={({ query, orderBy, orderDirection }) => {
          setNameQuery(query ?? '');
          setOrderBy(orderBy!);
          setOrderDirection(orderDirection!);
        }}
        rightHeader={
          role?.canConfigureServiceLevelIndicators && (
            <Button
              kind="action"
              onClick={() => {
                track(SLI_MANAGEMENT_CREATE_START, {
                  entityType
                });
                onCreateConfig();
              }}
              icon="lib_openclose_add_circle_outline"
              className={locals.createButton}
            >
              {t('in-custom-dashboards:widgets.slo.sliManageList.createSli')}
            </Button>
          )
        }
        query={nameQuery}
        orderBy={orderBy}
        orderDirection={orderDirection}
        selectSli={sli => onChange(sli as SliConfigBySliType<S>)}
        onDelete={onDeleteConfig}
        onEdit={sli => onEditConfig(sli as SliConfigBySliType<S>)}
      />
    </div>
  );
}

function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-custom-dashboards:widgets.slo.sliList.sliConfigDeleted')
    },
    'custom-dashboard-info'
  );
}

function onDeleteFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-custom-dashboards:widgets.slo.sliList.failedDelSli')
    },
    'custom-dashboard-error'
  );
}
