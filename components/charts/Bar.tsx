import { Group, RoundedRect, Text } from "@shopify/react-native-skia";
import DefaultChartFont from "./Font";
import { minBarHeight } from "../../models/charts/chartConstants";

const barCornerRadius = 16;

type BarMetrics = {
  x: number;
  y: number;
  height: number;
  isNegative: boolean;
};

export const calculateBarMetrics = (
  value: number,
  index: number,
  barWidth: number,
  spacing: number,
  scaleY: number,
  chartHeight: number,
  barOffset: number,
  yAxisWidth: number,
  baselineY: number
): BarMetrics => {
  const isNegative = value < 0;
  const absoluteHeight = Math.max(minBarHeight, Math.abs(value) * scaleY);
  const x = yAxisWidth + index * (barWidth + spacing) + barOffset;

  // For negative values, y starts at baseline and goes down
  // For positive values, y starts at baseline and goes up
  const y = isNegative ? baselineY : baselineY - absoluteHeight;

  return {
    x,
    y,
    height: absoluteHeight,
    isNegative
  };
};

type BarProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
  labelColor: string;
  isNegative: boolean;
};

function Bar({
  x,
  y,
  width,
  height,
  color,
  label,
  labelColor,
  isNegative
}: BarProps) {
  const roundedRectConfig = {
    rect: { x, y, width, height },
    topLeft: { x: isNegative ? 0 : barCornerRadius, y: isNegative ? 0 : barCornerRadius },
    topRight: { x: isNegative ? 0 : barCornerRadius, y: isNegative ? 0 : barCornerRadius },
    bottomRight: { x: isNegative ? barCornerRadius : 0, y: isNegative ? barCornerRadius : 0 },
    bottomLeft: { x: isNegative ? barCornerRadius : 0, y: isNegative ? barCornerRadius : 0 },
  };

  return (
    <Group>
      <Text
        x={Math.max(0, Math.min(x, x - 9))}
        y={y + height + 15}// (isNegative ? height + 35 : -5)}
        text={label}
        color={labelColor}
        font={DefaultChartFont}
      />
      <RoundedRect rect={roundedRectConfig} color={color} />
    </Group>
  );
}

export default Bar;