import { Group, Line, DashPathEffect, Text } from '@shopify/react-native-skia';

import { NewBrandingColours } from '../../styles/brandingConstants';
import { formatNumber } from '../../data/numberUtils';
import DefaultChartFont from './Font';

type HorizontalLinesProps = {
  lines: { y: number; value: number }[];
  width: number;
  yAxisWidth: number;
};

function HorizontalLines({ lines, width, yAxisWidth }: HorizontalLinesProps) {
  return (
    <>
      {lines.map(({ y, value }) => (
        <Group key={`line-${value}`}>
          <Line
            p1={{ x: yAxisWidth, y }}
            p2={{ x: width, y }}
            color={NewBrandingColours.neutral.darkGray}
            strokeWidth={0.3}
          >
            <DashPathEffect intervals={[10, 5]} />
          </Line>
          <Text
            x={0}
            y={y - 3}
            text={formatNumber(value)}
            font={DefaultChartFont}
            color={NewBrandingColours.text.muted}
          />
        </Group>
      ))}
    </>
  );
}

export default HorizontalLines;
