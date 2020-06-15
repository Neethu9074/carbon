import MuiSlider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import theme from 'in-themes';

export const StyledMuiSliderBase = withStyles({
  root: {
    fontFamily: theme.lib.fontFamily,
    color: theme.lib.colors.teal800,
    top: 0,
    lineHeight: 1.5,
    marginTop: 32
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
})(MuiSlider);

StyledMuiSliderBase.propTypes = {
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  valueLabelFormat: PropTypes.func,
  valueLabelDisplay: PropTypes.oneOf(['on', 'off', 'auto']),
  disabled: PropTypes.bool,
  style: PropTypes.any,
  value: PropTypes.number.isRequired
};
