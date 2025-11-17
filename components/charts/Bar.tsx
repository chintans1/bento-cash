import { Circle, Group, Path, RoundedRect, Text, rrect } from '@shopify/react-native-skia';
import DefaultChartFont from './Font';
import { minBarHeight } from '../../models/charts/chartConstants';
import { NewBrandingColours } from '../../styles/brandingConstants';
import { useEffect, useMemo } from 'react';
import { useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';

const barCornerRadius = 16;
const tooltipPadding = 4;
const tooltipHeight = 24;
const springConfig = {
  mass: 1,
  damping: 15,
  stiffness: 120,
};

// Helper function to adjust color opacity
const adjustColorOpacity = (color: string, opacity: number) => {
  return color + Math.round(opacity * 255).toString(16).padStart(2, '0');
};

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
  barOffset: number,
  yAxisWidth: number,
  baselineY: number,
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
    isNegative,
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
  index: number;
  activeIndex: number;
  value: number;
};

function Bar({
  x,
  y,
  width,
  height,
  color,
  label,
  labelColor,
  isNegative,
  index,
  activeIndex,
  value,
}: BarProps) {
  const isActive = activeIndex === index;
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(isActive ? 1 : 0, springConfig);
  }, [isActive]);

  // Add debug logging
  useEffect(() => {
    if (isActive) {
      console.log('Debug Tooltip:', {
        backgroundColor: NewBrandingColours.neutral.white,
        tooltipOpacity: animation.value,
        position: {
          x: x + (width / 2),
          y: y,
          tooltipX: x + (width / 2) - (Math.max(90, String(value).length * 14) / 2),
          tooltipY: isNegative
            ? y + height + tooltipPadding
            : y - tooltipHeight - tooltipPadding,
        },
        dimensions: {
          width: Math.max(90, String(value).length * 14),
          height: tooltipHeight,
        }
      });
    }
  }, [isActive, x, y, width, height, value, animation.value]);

  const formattedValue = Math.abs(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Calculate tooltip dimensions based on value length
  // const tooltipWidth = Math.max(90, formattedValue.length * 14);
  // const tooltipX = x + (width / 2) - (tooltipWidth / 2);
  const textWidth = DefaultChartFont.measureText("$" + formattedValue).width;

  const tooltipWidth = Math.max(textWidth + 20, 90); // Minimum width for balance
  const tooltipX = Math.max(0, x + (width / 2) - (tooltipWidth / 2)); // Ensure it doesn't overflow left
  const tooltipY = isNegative
    ? y + height + tooltipPadding
    : y - tooltipHeight - tooltipPadding;

  const tooltipOpacity = useDerivedValue(() => animation.value);

  const centeredX = tooltipX + (tooltipWidth / 2) - (textWidth / 2);

  const roundedRectConfig = {
    rect: { x, y, width, height },
    topLeft: {
      x: isNegative ? 0 : barCornerRadius,
      y: isNegative ? 0 : barCornerRadius,
    },
    topRight: {
      x: isNegative ? 0 : barCornerRadius,
      y: isNegative ? 0 : barCornerRadius,
    },
    bottomRight: {
      x: isNegative ? barCornerRadius : 0,
      y: isNegative ? barCornerRadius : 0,
    },
    bottomLeft: {
      x: isNegative ? barCornerRadius : 0,
      y: isNegative ? barCornerRadius : 0,
    },
  };

  const hoverTooltipRectConfig = {
    rect: { x: tooltipX, y: tooltipY, width, height: tooltipHeight },
    topLeft: { x: 0, y: 0},
    topRight: { x: 0, y: 0},
    bottomRight: { x: 0, y: 0},
    bottomLeft: { x: 0, y: 0},
  }

  // Adjust position if overlapping nearby bars
  const adjustedTooltipX = Math.max(
    tooltipX,
    x - tooltipWidth / 2, // Prevent overlap with left bar
  );
  const adjustedTooltipY = tooltipY; // Can be adjusted further if needed

  /*
  {rrect(
              {
                x: tooltipX,
                y: tooltipY,
                width: tooltipWidth,
                height: tooltipHeight
              },
              tooltipRadius,
              tooltipRadius
            )}
              */

  return (
    <Group>
      <Group>
        <RoundedRect rect={roundedRectConfig} color={color} />

        <Text
          x={Math.max(0, Math.min(x, x - 9))}
          y={y + height + 15}
          text={label}
          color={labelColor}
          font={DefaultChartFont}
        />
      </Group>

      {isActive && (
        <Group>
          {/* <RoundedRect rect={hoverTooltipRectConfig} color={color} /> */}
          {/* <Text
            x={centeredX}
            y={tooltipY + (tooltipHeight / 2) + 5} // Adjust for vertical centering
            text={"$" + formattedValue}
            color={labelColor}
            font={DefaultChartFont}
          /> */}

          {/* Tooltip Background */}
          <RoundedRect
            x={adjustedTooltipX}
            y={adjustedTooltipY}
            width={tooltipWidth}
            height={tooltipHeight}
            r={barCornerRadius} // Rounded corners
            color={color} // Modern dark background
          />

          {/* Tooltip Text */}
          <Text
            x={adjustedTooltipX + (tooltipWidth / 2) - (textWidth / 2)}
            y={adjustedTooltipY + tooltipHeight / 2 + 5}
            text={"$" + formattedValue}
            color={NewBrandingColours.neutral.white}
            font={DefaultChartFont}
          />
        </Group>
      )}
    </Group>
  );
}

export default Bar;
