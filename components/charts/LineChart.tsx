import React from 'react';
import { Dimensions } from 'react-native';
import {
  Canvas,
  Path,
  Skia,
  Circle,
  Text,
  useFont,
} from '@shopify/react-native-skia';
import { NewBrandingColours } from '../../styles/brandingConstants';
import HorizontalLines from './HorizontalLines';
import Font from './Font';

export type LineDataset = {
  data: number[];
  color: string;
  label: string;
};

export interface LineChartProps {
  data: {
    labels: string[];
    datasets: LineDataset[];
  };
  width?: number;
  height?: number;
  labelColor?: string;
  showDots?: boolean;
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

function LineChart({
  data,
  width: propWidth,
  height: propHeight = 200,
  labelColor = NewBrandingColours.text.muted,
  showDots = true,
}: LineChartProps) {
  const font = useFont(Font, 11);

  const { width, height, chartHeight, adjustedWidth } =
    calculateChartDimensions(propWidth, propHeight);
  const { labels, datasets } = data;

  // Calculate chart values
  const maxValue = Math.max(...datasets.flatMap(dataset => dataset.data));
  const chartMaxValue = calculateNiceMaxValue(maxValue);
  const scaleY = height / chartMaxValue;

  // Calculate the horizontal dashed lines
  const numberOfLines = 3;
  const horizontalLines = Array.from({ length: numberOfLines }, (_, i) => {
    const y = height - (height * (i + 1)) / numberOfLines + topMargin;
    const value = Math.round((chartMaxValue * (i + 1)) / numberOfLines);
    return { y, value };
  });

  // Calculate spacing between points
  const pointSpacing = adjustedWidth / (labels.length - 1);

  // Generate paths for each dataset
  const paths = datasets.map(dataset => {
    const path = Skia.Path.Make();

    dataset.data.forEach((value, index) => {
      const x = yAxisWidth + index * pointSpacing;
      const y = topMargin + height - value * scaleY;

      if (index === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });

    return path;
  });

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

      {/* Draw lines for each dataset */}
      {datasets.map((dataset, datasetIndex) => {
        const path = paths[datasetIndex];

        return (
          <React.Fragment key={`dataset-${datasetIndex}`}>
            {/* Line path */}
            <Path
              path={path}
              color={dataset.color}
              style="stroke"
              strokeWidth={3}
              strokeCap="round"
              strokeJoin="round"
            />

            {/* Data point dots */}
            {showDots &&
              dataset.data.map((value, index) => {
                const x = yAxisWidth + index * pointSpacing;
                const y = topMargin + height - value * scaleY;

                return (
                  <Circle
                    key={`dot-${datasetIndex}-${index}`}
                    cx={x}
                    cy={y}
                    r={4}
                    color={dataset.color}
                  />
                );
              })}
          </React.Fragment>
        );
      })}

      {/* X-axis labels */}
      {labels.map((label, index) => {
        const x = yAxisWidth + index * pointSpacing;
        const y = chartHeight + 15;

        return (
          <Text
            key={`label-${index}`}
            x={x - 15}
            y={y}
            text={label}
            font={font}
            color={labelColor}
          />
        );
      })}
    </Canvas>
  );
}

export default LineChart;
