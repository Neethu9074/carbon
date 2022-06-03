/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// eslint-disable-next-line no-restricted-imports
import styled from '@emotion/styled';
import Slider from '@mui/material/Slider';
import PropTypes from 'prop-types';

import theme from 'in-themes';

const BaseSlider = styled(Slider)(`
    font-family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
    color: ${theme.lib.colors.teal800};
    top: 0;
    line-height: 1.5;
    margin-bottom: 16px;

    margin-top: ${props => (props.valueLabelDisplay === 'on' ? '16px' : '32px')};

    .MuiSlider-mark {
      width: 4px;
      margin-left: -2px;
    }

    .MuiSlider-valueLabel {
      color: ${theme.lib.colors.white};
      padding: 0;
      top: -22px;
      height: auto;
      left: unset;
      font-size: 12px;
      &:before {
        display: none;
      }
    }

    .MuiSlider-valueLabelCircle {
      width: unset;
      transform: unset;
      background: ${theme.lib.colors.N500};
      border-radius: ${theme.lib.shapes.radius_small};
      margin: 0;
      padding: 4px;
      height: 100%;
    }

    .MuiSlider-valueLabelLabel {
      width: max-content;
      lineHeight: 16px
    }

    .MuiSlider-markLabel {
      font-size: ${theme.lib.typography.h100.fontSize};
      color: ${theme.lib.colors.N600Light};
      height: 16px;
    }

    .MuiSlider-mark {
      margin-top: 0;
      background-image: none;
    }

    .MuiSlider-markLabelActive {
      color: ${theme.lib.colors.N900Primary};
    }

    .MuiSlider-rail {
      height: 2px;
      opacity: 1;
      color: ${theme.lib.colors.N400};
    }

    .MuiSlider-thumb {
      width: 12px;
      height: 12px;
    }

    .MuiSlider-track {
      height: 2px;
    }

    .Mui-active {
      opacity: 1;
      background-color: 'currentColor';
    }
`);

export default BaseSlider;

BaseSlider.propTypes = {
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
