import React from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  RoundedRect,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import { NewBrandingColours } from '../../styles/brandingConstants';
import HorizontalLines from './HorizontalLines';
import Font from './Font';

export type StackedDataset = {
  data: number[];
  color: string;
  label: string;
};

export interface StackedBarChartProps {
  data: {
    labels: string[];
    datasets: StackedDataset[];
  };
  width?: number;
  height?: number;
  labelColor?: string;
  spacing?: number;
  stacked?: boolean; // true for stacked, false for grouped/overlayed
}

// Sizing constants
const topMargin = 20;
const yAxisWidth = 20;
const bottomMargin = 25;

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
  if (value === 0) return 100;

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

function StackedBarChart({
  data,
  width: propWidth,
  height: propHeight = 200,
  labelColor = NewBrandingColours.text.muted,
  spacing = 15,
  stacked = true,
}: StackedBarChartProps) {
  const font = useFont(Font, 11);

  const { width, height, chartHeight, adjustedWidth } =
    calculateChartDimensions(propWidth, propHeight);
  const { labels, datasets } = data;

  // Calculate max value - for stacked, sum all datasets; for grouped, find max
  const maxValue = stacked
    ? Math.max(
        ...labels.map((_, index) =>
          datasets.reduce((sum, dataset) => sum + dataset.data[index], 0),
        ),
      )
    : Math.max(...datasets.flatMap(dataset => dataset.data));

  const chartMaxValue = calculateNiceMaxValue(maxValue);
  const scaleY = height / chartMaxValue;

  // Calculate the horizontal dashed lines
  const numberOfLines = 3;
  const horizontalLines = Array.from({ length: numberOfLines }, (_, i) => {
    const y = height - (height * (i + 1)) / numberOfLines + topMargin;
    const value = Math.round((chartMaxValue * (i + 1)) / numberOfLines);
    return { y, value };
  });

  const barWidth = calculateBarDimensions(
    adjustedWidth,
    labels.length,
    spacing,
  );

  if (!font) {
    return null;
  }

  return (
    <Canvas style={{ width, height: chartHeight + bottomMargin }}>
      {/* Horizontal grid lines */}
      <HorizontalLines
        lines={horizontalLines}
        width={width}
        yAxisWidth={yAxisWidth}
      />

      {/* Draw bars */}
      {labels.map((label, labelIndex) => {
        const baseX = yAxisWidth + labelIndex * (barWidth + spacing);
        let cumulativeHeight = 0;

        return (
          <React.Fragment key={`bar-group-${labelIndex}`}>
            {/* Draw stacked bars */}
            {stacked ? (
              datasets.map((dataset, datasetIndex) => {
                const value = dataset.data[labelIndex];
                const barHeight = value * scaleY;
                const x = baseX;
                const y = topMargin + height - cumulativeHeight - barHeight;

                cumulativeHeight += barHeight;

                return (
                  <RoundedRect
                    key={`bar-${labelIndex}-${datasetIndex}`}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    r={4}
                    color={dataset.color}
                  />
                );
              })
            ) : (
              // Draw overlayed bars (for cash flow effect)
              datasets
                .slice()
                .reverse()
                .map((dataset, datasetIndex) => {
                  const value = dataset.data[labelIndex];
                  const barHeight = value * scaleY;
                  const x = baseX;
                  const y = topMargin + height - barHeight;

                  return (
                    <RoundedRect
                      key={`bar-${labelIndex}-${datasetIndex}`}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      r={4}
                      color={dataset.color}
                      opacity={datasetIndex === 0 ? 1 : 0.7}
                    />
                  );
                })
            )}

            {/* X-axis label */}
            <Text
              key={`label-${labelIndex}`}
              x={baseX}
              y={chartHeight + 15}
              text={label}
              font={font}
              color={labelColor}
            />
          </React.Fragment>
        );
      })}
    </Canvas>
  );
}

export default StackedBarChart;
