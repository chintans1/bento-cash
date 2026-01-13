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
  stacked?: boolean;
}
