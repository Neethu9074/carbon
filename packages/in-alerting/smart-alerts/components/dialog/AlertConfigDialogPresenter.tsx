/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useState } from 'react';
import { Field, MapForm, Item } from 'formalistic';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData, TimeConfig } from '@instana/types';
import { Button } from '@instana/components';

import { SimpleModeContainerProps } from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import { Title } from 'in-components/Dialog/Header';
import { t } from 'in-i18n';

import locals from './AlertConfigDialogPresenter.mless';

export type MainDialogControl = {
  onCreate: () => void;
  onClose: (step: number | false | undefined) => void;
  setSliderState: ({ slideInConfig, isVisible }: SliderState) => void;
  setSimpleModeStep: (step: number) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
};

export interface AlertConfigDialogPresenterProps {
  stepConfigs?: StepConfigs;
  step?: number;
  //stepRenderers: (() => ReactNode)[];
  AdvancedModeElement: (props: AlertConfigDialogPresenterProps & MainDialogControl) => JSX.Element;
  form: MapForm<any>;
  handleSubmit: () => void;
  formId: string;
  SimpleModeElement: (
    props: AlertConfigDialogPresenterProps & MainDialogControl & SimpleModeContainerProps
  ) => JSX.Element;
  footer?: ReactNode;
  trackModeSwitch?: (simpleMode: boolean, simpleModeStep: number, form: MapForm<any>) => void;
  updateForm: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  withTrackClose: (step: number | false | undefined) => void;
  withTrackCreate: () => void;
  simpleMode?: boolean;
  setSimpleMode: (simpleMode: boolean) => void;
  editMode?: boolean;
  migrationMode?: boolean;
  featureFeedbackElement?: () => ReactNode;
  initialConfiguredApplications?: object;
  isGlobalSmartAlert?: boolean;
  QueryBuilderComponent: QueryBuilderComponent;
  isTagFilterFormModelValid: boolean;
  TagBasedPayloadConfigurator: React.FunctionComponent<any>;
  isDynamicCustomPayloadValid: boolean;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
  timeConfig?: TimeConfig;
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null;
  setTagFilterValid?: React.Dispatch<React.SetStateAction<boolean>>;
  tagFilterValid?: boolean;
}

export interface SlideInConfig {
  title?: string;
  component?: ReactNode;
}

export interface SliderState {
  slideInConfig?: SlideInConfig;
  isVisible: boolean;
}

export default function AlertConfigDialogPresenter(props: AlertConfigDialogPresenterProps & SimpleModeContainerProps) {
  const {
    editMode,
    migrationMode,
    form,
    formId,
    handleSubmit,
    AdvancedModeElement,
    SimpleModeElement,
    setSimpleMode,
    simpleMode,
    trackModeSwitch,
    withTrackClose,
    withTrackCreate,
    updateForm,
    footer,
    isGlobalSmartAlert,
    setTagFilterValid,
    tagFilterValid
  } = props;

  const [slideInViewVisible, setSlideInViewVisible] = useState<boolean>(false);
  const [slideInConfig, setSlideInConfig] = useState<SlideInConfig | null>(null);
  const [simpleModeStep, setSimpleModeStep] = useState<number>(0);

  const [customSlideInHeaderConfig, setCustomSlideInHeaderConfig] = useState<{
    title: string | null;
    onClose: (() => void) | null;
  }>({
    title: null,
    onClose: null
  });

  const builtIn: boolean = (form.get('builtIn') as Field<boolean>)?.value;

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideInConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  return (
    <DialogWithSlideInView
      footer={footer}
      title={getDialogTitle({ isGlobalSmartAlert, editMode, migrationMode, builtIn })}
      slideInViewTitle={customSlideInHeaderConfig?.title ?? slideInConfig?.title}
      onSlideInViewTitleClick={() =>
        customSlideInHeaderConfig.onClose
          ? customSlideInHeaderConfig.onClose()
          : setSlideInViewVisible(!slideInViewVisible)
      }
      titleIconType="lib_alerts_create"
      onClose={() => withTrackClose(simpleMode && simpleModeStep)}
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      renderCustomCloseBehaviour={resetScrollShadow => (
        <>
          {!editMode && simpleMode && (
            <Button
              onClick={() => {
                resetFormDirtyState();
                // optionally track switching when function is defined:
                trackModeSwitch?.(simpleMode, simpleModeStep, form);
                const newMode = !simpleMode;
                setSimpleMode(newMode);
                resetScrollShadow();
              }}
              kind="action"
            >
              {t(
                'in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterButtonSwitchToAdvancedMode'
              )}
            </Button>
          )}
        </>
      )}
      doNotCloseOnOutsideClick
      removeBottomPaddingWhenFooterIsShown
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
        className={classNames({
          [locals.dialog]: true,
          [locals.advancedMode]: !simpleMode
        })}
      >
        {simpleMode ? (
          <SimpleModeElement
            {...props}
            onCreate={withTrackCreate}
            onClose={withTrackClose}
            setSliderState={setSliderState}
            setSimpleModeStep={setSimpleModeStep}
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
          />
        ) : (
          <AdvancedModeElement
            {...props}
            onCreate={withTrackCreate}
            onClose={withTrackClose}
            setSliderState={setSliderState}
            setSimpleModeStep={setSimpleModeStep}
            setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
            setTagFilterValid={setTagFilterValid}
            tagFilterValid={tagFilterValid}
          />
        )}
      </form>
    </DialogWithSlideInView>
  );

  /**
   * Reset the dirty state of the form, to be in a clean state in teh respective mode.
   * This prevents that buttons are disabled when violators evaluate to false and dirty state is true.
   */
  function resetFormDirtyState() {
    if (!form.hierarchyValid) {
      updateForm?.(form.setTouched(false, { recurse: true }));
    }
  }
}

// TODO this is specific to alerting area, and most all properties should be moved out of this module instead of
// setting the dialog title here
function getDialogTitle({
  isGlobalSmartAlert,
  editMode,
  migrationMode,
  builtIn
}: {
  editMode?: boolean;
  migrationMode?: boolean;
  isGlobalSmartAlert?: boolean;
  builtIn: boolean;
}) {
  const mode = isGlobalSmartAlert ? 'Global' : 'Local';
  let title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleCreateNewAlert', {
    context: mode
  });
  if (migrationMode) {
    title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleMigrateAlert', {
      context: mode
    });
  } else if (editMode) {
    title = t('in-alerting:smartAlerts.components.smartAlertDialog.alertConfigDialogPresenterTitleEditAlert', {
      context: mode
    });
  }
  return (
    <HorizontalFlexWrapper className={locals.titleWrapper}>
      <Title title={title} />
      <BuiltInIndicator builtIn={builtIn} />
    </HorizontalFlexWrapper>
  );
}

AlertConfigDialogPresenter.propTypes = {
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ),
  stepRenderers: PropTypes.arrayOf(PropTypes.func).isRequired,
  step: PropTypes.number,
  AdvancedModeElement: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formId: PropTypes.string.isRequired,
  SimpleModeElement: PropTypes.func.isRequired,
  footer: PropTypes.node,
  trackModeSwitch: PropTypes.func,
  updateForm: PropTypes.func,
  withTrackClose: PropTypes.func.isRequired,
  withTrackCreate: PropTypes.func.isRequired,
  simpleMode: PropTypes.bool,
  setSimpleMode: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  migrationMode: PropTypes.bool,
  initialConfiguredApplications: PropTypes.object,
  isGlobalSmartAlert: PropTypes.bool
};
