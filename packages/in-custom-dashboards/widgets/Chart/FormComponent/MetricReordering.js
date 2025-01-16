/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import React from 'react';

import { ColumnizedContent, Li, Stack, SvgIcon, toInteractiveElement, Ul, Pill } from '@instana/components';

import {
  formatterPath,
  metricsPath,
  useChartFormatterDragAndDropFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { getMetricId, getMetricLabel, getMetricUnit } from 'in-custom-dashboards/widgets/Chart/util';
import ColorConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/ColorConfigurator';
import { refreshDFQ$ } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './AxesConfigurator.mless';

export const columnDefinitions = [
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ dragHandleProps }) {
      return (
        <div className={locals.dragHandleWrapper} {...dragHandleProps}>
          <SvgIcon className={locals.dragHandle} type="lib_actions_reorder" />
        </div>
      );
    }
  },
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ index, axisName, indexInAxis, getShortMetricKey }) {
      return (
        <Pill
          kind="info"
          {...toInteractiveElement({
            onDefaultInteraction: () => triggerHighlight(getMetricId(index)),
            ariaLabel: t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.jumpConfigDataset')
          })}
          className={locals.pill}
        >
          {getShortMetricKey(axisName, indexInAxis)}
        </Pill>
      );
    }
  },
  {
    getContent({ metricForm }) {
      let title = getMetricLabel(metricForm.toJS());
      if (metricForm.get('timeShift').value !== 0) {
        title = (
          <Tooltip content={t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasetTimeShift')}>
            <span className={locals.timeShifted}>
              {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
            </span>
          </Tooltip>
        );
      }

      return <div className={locals.title}>{title}</div>;
    }
  },
  {
    x: 'unitPill',
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent({ metricForm }) {
      return (
        <div className={locals.pillWrapper}>
          <Pill size="lg" kind="info">
            {getMetricUnit(metricForm.toJS())}
          </Pill>
        </div>
      );
    }
  },
  {
    x: 'colorConfigurator',
    forceMinimumWidth: true,
    verticallyCenter: true,
    shrink: false,
    getContent(args) {
      return <ColorConfigurator {...args} />;
    }
  }
];

export function Reorderer({ form, onChange, children }) {
  const updateForm = useChartFormatterDragAndDropFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
    refreshDFQ$.emit(true);
  });
  return (
    <DragDropContext
      onDragEnd={e => {
        if (!e.destination) {
          return;
        }

        updateForm(
          form.updateIn([], form => {
            const metric = form.getIn([e.source.droppableId, metricsPath, e.source.index]);
            form = form
              .updateIn([e.source.droppableId, metricsPath], f => f.remove(e.source.index).setTouched(true))
              .updateIn([e.destination.droppableId, metricsPath], f =>
                f.insert(e.destination.index, metric).setTouched(true)
              );

            if (form.containsKey(formatterPath)) {
              const formatterSource = form.getIn([e.source.droppableId, formatterPath])?.value;
              form = form.updateIn([e.destination.droppableId, formatterPath], f =>
                f.setValue(formatterSource).setTouched(true)
              );
            }
            return form;
          })
        );
      }}
    >
      {children}
    </DragDropContext>
  );
}

export function MetricsForAxis({
  form,
  onChange,
  axisName,
  startIndex,
  getShortMetricKey,
  isColorConfiguratorEnabled = true,
  withUnitPill = false,
  helpText = t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.dragDropDataset2Axes')
}) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get(metricsPath);

  const showHelpText = metricsForm.size === 0;
  const columnsDefinitions = columnDefinitions
    .filter(({ x }) => x !== 'colorConfigurator' || isColorConfiguratorEnabled)
    .filter(({ x }) => x !== 'unitPill' || withUnitPill);

  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.formCompChart.metricReorderingChart.datasets')}</Header>

      <TouchedMessages field={metricsForm} />

      <Droppable droppableId={axisName}>
        {provided => (
          <Stack gap="xxsmall" ref={provided.innerRef}>
            {metricsForm.map((metricForm, indexInAxis) => (
              // Note: react beautiful dnd requires keys to be stable or at least stable while dragging.
              // Usage of indexInAxis is therefore not sufficient. You can validate this by trying to drag
              // the first (and only) metric for a y2 axis.
              <Draggable
                key={String(startIndex + indexInAxis)}
                draggableId={String(startIndex + indexInAxis)}
                index={indexInAxis}
              >
                {provided => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Ul>
                      <Li noAlternatingBg className={locals.draggableItem}>
                        <ColumnizedContent
                          columnDefinitions={getFilteredColumnDefinitionsForSource(
                            columnsDefinitions,
                            metricForm.toJS()?.source
                          )}
                          axisName={axisName}
                          metricForm={metricForm}
                          form={form}
                          onChange={onChange}
                          indexInAxis={indexInAxis}
                          index={startIndex + indexInAxis}
                          dragHandleProps={provided.dragHandleProps}
                          getShortMetricKey={getShortMetricKey}
                        />
                      </Li>
                    </Ul>
                  </div>
                )}
              </Draggable>
            ))}

            {showHelpText && <p className={locals.dragAndDropHelpText}>{helpText}</p>}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </Stack>
  );
}

function getFilteredColumnDefinitionsForSource(columnsDefinitions, source) {
  return columnsDefinitions.filter(({ x }) => x !== 'unitPill' || source === 'INFRASTRUCTURE_METRICS');
}
