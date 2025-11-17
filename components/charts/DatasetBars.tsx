import { Dataset } from '../../models/charts/chartModels';
import { topMargin } from '../../models/charts/chartConstants';
import Bar, { calculateBarMetrics } from './Bar';
import { Group } from '@shopify/react-native-skia';

type DatasetBarsProps = {
  datasets: Dataset[];
  labels: string[];
  barWidth: number;
  height: number;
  scaleY: number;
  spacing: number;
  labelColor: string;
  yAxisWidth: number;
  labelOnlyStartEnd?: boolean;
  activeIndex: number;
};

function DatasetBars({
  datasets,
  labels,
  barWidth,
  height,
  scaleY,
  spacing,
  labelColor,
  yAxisWidth,
  labelOnlyStartEnd = true,
  activeIndex,
}: DatasetBarsProps) {
  const hasNegativeValues = datasets.some(dataset =>
    dataset.data.some(value => value < 0),
  );

  const baselineY = hasNegativeValues
    ? height / 2 + topMargin
    : height + topMargin;

  return (
    <Group>
      {datasets.map((dataset, datasetIndex) => {
        const barOffset = datasetIndex * (barWidth + 5);

        return dataset.data.map((value, index) => {
          const metrics = calculateBarMetrics(
            value,
            index,
            barWidth,
            spacing,
            scaleY,
            barOffset,
            yAxisWidth,
            baselineY,
          );

          const color =
            value === 0
              ? `${dataset.color()}80`
              : value < 0
                ? dataset.negativeColor()
                : dataset.color();

          const showLabel =
            !labelOnlyStartEnd ||
            index === 0 ||
            index === dataset.data.length - 1;

          return (
            <Bar
              key={`${datasetIndex}-${labels[index]}-${value}`}
              x={metrics.x}
              y={metrics.y}
              width={barWidth}
              height={metrics.height}
              color={color}
              label={showLabel ? labels[index] : ''}
              labelColor={labelColor}
              isNegative={metrics.isNegative}
              index={index}
              activeIndex={activeIndex}
              value={value}
            />
          );
        });
      })}
    </Group>
  );
}

export default DatasetBars;
