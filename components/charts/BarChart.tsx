import React from 'react';
import { Dimensions } from 'react-native';
import { Canvas } from '@shopify/react-native-skia';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { BarChartProps } from '../../models/charts/chartModels';
import HorizontalLines from './HorizontalLines';
import DatasetBars from './DatasetBars';

// Sizing constants
const topMargin = 20;
const yAxisWidth = 20;

const calculateChartDimensions = (
  givenWidth: number = Dimensions.get('window').width - 40,
  givenHeight: number = 200,
) => {
  const chartHeight = givenHeight + topMargin;
  const adjustedWidth = givenWidth - yAxisWidth;

  return { width: givenWidth, height: givenHeight, chartHeight, adjustedWidth };
};

const calculateBarDimensions = (
  adjustedWidth: number,
  dataPoints: number,
  spacing: number,
) => {
  return (adjustedWidth - spacing * (dataPoints - 1)) / dataPoints;
};

// Calculate a nice rounded maximum value
const calculateNiceMaxValue = (value: number): number => {
  const magnitude = Math.floor(Math.log10(value));
  const power = 10 ** magnitude;
  const normalized = value / power;

  let niceMax: number;
  if (normalized <= 1.2) niceMax = 1.2;
  else if (normalized <= 1.5) niceMax = 1.5;
  else if (normalized <= 2) niceMax = 2;
  else if (normalized <= 2.5) niceMax = 2.5;
  else if (normalized <= 3) niceMax = 3;
  else if (normalized <= 4) niceMax = 4;
  else if (normalized <= 5) niceMax = 5;
  else if (normalized <= 6) niceMax = 6;
  else if (normalized <= 8) niceMax = 8;
  else niceMax = 10;

  return niceMax * power;
};

function BarChart({
  data,
  width: propWidth,
  height: propHeight = 200,
  labelColor = NewBrandingColours.text.muted,
  spacing = 15,
  maxValue,
}: BarChartProps) {
  const { width, height, chartHeight, adjustedWidth } =
    calculateChartDimensions(propWidth, propHeight);
  const { labels, datasets } = data;

  // Calculate chart values
  const rawMaxValue =
    maxValue || Math.max(...datasets.flatMap(dataset => dataset.data.map(Math.abs)));

  const hasNegativeValues = datasets.some(dataset => dataset.data.some(value => value < 0));

  const chartMaxValue = calculateNiceMaxValue(rawMaxValue);
  const scaleY = hasNegativeValues ? (height / 2) / chartMaxValue : height / chartMaxValue;
    //height / chartMaxValue;

  // Calculate the horizontal dashed lines
  const numberOfLines = 2;
  const horizontalLines = hasNegativeValues
    ? [
      // Positive lines
      ...Array.from({ length: numberOfLines }, (_, i) => {
        const value = Math.round((chartMaxValue * (i + 1)) / numberOfLines);
        const y = (height / 2) - (height / 2 * (i + 1)) / numberOfLines + topMargin;
        return { y, value };
      }),
      // Negative lines
      ...Array.from({ length: numberOfLines }, (_, i) => {
        const value = -Math.round((chartMaxValue * (i + 1)) / numberOfLines);
        const y = (height / 2) + (height / 2 * (i + 1)) / numberOfLines + topMargin;
        return { y, value };
      })
    ]
    : Array.from({ length: numberOfLines }, (_, i) => {
      const y = height - (height * (i + 1)) / numberOfLines + topMargin;
      const value = Math.round((chartMaxValue * (i + 1)) / numberOfLines);
      return { y, value };
    });

  const barWidth = calculateBarDimensions(
    adjustedWidth,
    labels.length,
    spacing,
  );

  return (
    <Canvas style={{ width, height: chartHeight + 22 }}>
      <HorizontalLines
        lines={horizontalLines}
        width={width}
        yAxisWidth={yAxisWidth}
      />
      <DatasetBars
        datasets={datasets}
        labels={labels}
        barWidth={barWidth}
        height={height}
        scaleY={scaleY}
        spacing={spacing}
        labelColor={labelColor}
        yAxisWidth={yAxisWidth}
      />
    </Canvas>
  );
}

export default BarChart;
