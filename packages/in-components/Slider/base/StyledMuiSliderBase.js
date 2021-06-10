/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import MuiSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

import theme from 'in-themes';

const common = {
  root: {
    fontFamily: theme.lib.fontFamily,
    color: theme.lib.colors.teal800,
    top: 0,
    lineHeight: 1.5,
    marginBottom: 16
  },
  mark: {
    width: 4,
    marginLeft: -2
  },
  valueLabel: {
    fontFamily: 'inherit',
    color: theme.lib.colors.white,
    padding: 0,
    top: -22,
    height: 'auto',
    left: 'unset',
    fontSize: '12px',

    '& span': {
      width: 'unset',
      transform: 'unset'
    },
    '& > span': {
      background: theme.lib.colors.N500,
      borderRadius: theme.lib.shapes.radius_small,
      margin: 0,
      height: '100%'
    },
    '& > span span': {
      width: 'max-content',
      padding: 4,
      lineHeight: '16px'
    }
  },
  markLabel: {
    fontFamily: 'inherit',
    ...theme.lib.typography.h100,
    color: theme.lib.colors.N600Light,
    height: 16
  },
  markLabelActive: {
    fontFamily: 'inherit',
    color: theme.lib.colors.N900Primary,
    height: 16
  },
  active: {
    opacity: 1,
    backgroundColor: 'currentColor'
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 1,
    color: theme.lib.colors.N400
  }
};

const withLabel = {
  ...common,
  root: {
    ...common.root,
    marginTop: 32
  }
};

const withoutLabel = {
  ...common,
  root: {
    ...common.root,
    marginTop: 16
  }
};

const SliderWithoutPermanentLabel = withStyles(withoutLabel)(MuiSlider);
const SliderWithPermanentLabel = withStyles(withLabel)(MuiSlider);

export const StyledMuiSliderBase = props => {
  if (props.valueLabelDisplay === 'on') {
    return <SliderWithPermanentLabel {...props} />;
  }
  return <SliderWithoutPermanentLabel {...props} />;
};

StyledMuiSliderBase.propTypes = {
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    }).isRequired
  ).isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  valueLabelFormat: PropTypes.func,
  valueLabelDisplay: PropTypes.oneOf(['on', 'off', 'auto']),
  disabled: PropTypes.bool,
  style: PropTypes.any,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.array])
};
