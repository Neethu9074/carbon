/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { Li, Button, Ul } from '@instana/components';

import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import DropdownButton from 'in-components/Button/DropdownButton';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './SortingConfigurator.mless';

export interface SortOption {
  label: string;
  value: string;
}

export type SortOrderBy = 'ASC' | 'DESC';

export interface SortOnChangeProp {
  by: string;
  direction: SortOrderBy;
}

interface Props {
  options: SortOption[];
  orderBy: SortOnChangeProp;
  onChange: (prop: SortOnChangeProp) => void;
}

interface OptionsProps {
  options: SortOption[];
  onChange: (prop: SortOnChangeProp) => void;
  orderBy: SortOnChangeProp;
  close: (e?: any) => void;
}

export default function SortingConfigurator({ options, orderBy, onChange }: Props) {
  const valueLabel =
    options.find(option => option.value === orderBy.by)?.label ?? t('in-components:sortingConfigurator.labelNA');
  const ref: React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | undefined> = useRef();

  return (
    <div className={locals.carbonConfigurtor}>
      <Overlay
        content={Options}
        props={{ options, onChange, orderBy }}
        onCloseSideEffect={() => ref.current?.focus()}
        wrapperClassName={locals.select}
      >
        {({ toggle, refSetter }) => {
          return (
            <DropdownButton
              className={locals.selectButton}
              kind="secondary"
              refSetter={compositeRef<HTMLElement>(refSetter, ref)}
              onClick={toggle}
            >
              {valueLabel}
            </DropdownButton>
          );
        }}
      </Overlay>
      <Button
        icon={orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
        kind="secondary"
        className={locals.sorting}
        onClick={() =>
          onChange({
            by: orderBy.by,
            direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
          })
        }
        size="compact"
      >
        {orderBy.direction === 'ASC'
          ? t('in-components:sortingConfigurator.buttonAscending')
          : t('in-components:sortingConfigurator.buttonDescending')}
      </Button>
    </div>
  );
}

function Options({ options, onChange, orderBy, close }: OptionsProps) {
  return (
    <Ul framed={false} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      <OverlayOptionTitle title={t('in-components:sortingConfigurator.headerLabel')} size="compact" />
      {options.map((option, i) => (
        <OverlayOption
          onChange={onChange}
          key={option.value}
          autoFocus={(orderBy.by == null && i === 0) || orderBy.by === option.value}
          close={close}
          value={{ by: option.value, direction: orderBy.direction }}
          size="compact"
        >
          {option.label}
        </OverlayOption>
      ))}
    </Ul>
  );
}

function OverlayOptionTitle({ title, size }: { title: string; size?: 'normal' | 'compact' }) {
  return (
    <Li className={locals.header} size={size}>
      {title}
    </Li>
  );
}
