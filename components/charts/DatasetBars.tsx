import { Group, RoundedRect, Text } from '@shopify/react-native-skia';
import { Dataset } from '../../models/charts/chartModels';
import DefaultChartFont from './Font';
import { minBarHeight, topMargin } from '../../models/charts/chartConstants';

type DatasetBarsProps = {
  datasets: Dataset[];
  labels: string[];
  barWidth: number;
  height: number;
  scaleY: number;
  spacing: number;
  labelColor: string;
  yAxisWidth: number;
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
}: DatasetBarsProps) {
  return (
    <>
      {datasets.map((dataset, datasetIndex) => {
        const barOffset = datasetIndex * (barWidth + 5);

        return dataset.data.map((value, index) => {
          const datasetId = `dataset-${index}`;

          const barHeight = value === 0 ? minBarHeight : value * scaleY;
          const x = yAxisWidth + index * (barWidth + spacing) + barOffset;
          const y = height - barHeight + topMargin;

          const roundedRectConfig = {
            rect: { x, y, width: barWidth, height: barHeight },
            topLeft: { x: 16, y: 16 },
            topRight: { x: 16, y: 16 },
            bottomRight: { x: 0, y: 0 },
            bottomLeft: { x: 0, y: 0 },
          };

          return (
            <Group key={`${labels[index]}-${datasetId}-${value}`}>
              <Text
                x={Math.max(0, Math.min(x, x - 9))}
                y={y + barHeight + 20}
                text={labels[index] || ''}
                color={labelColor}
                font={DefaultChartFont}
              />
              <RoundedRect
                rect={roundedRectConfig}
                color={value === 0 ? `${dataset.color()}80` : dataset.color()}
              />
            </Group>
          );
        });
      })}
    </>
  );
}

export default DatasetBars;
