export type Dataset = {
  data: number[];
  color: () => string;
  negativeColor: () => string;
};

export interface BarChartProps {
  data: {
    labels: string[];
    datasets: Dataset[];
  };
  width?: number;
  height?: number;
  labelColor?: string;
  spacing?: number;
  maxValue?: number;
}
