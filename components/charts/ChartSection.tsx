import { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { NewBrandingColours } from "../../styles/brandingConstants";
import BarChart from "./BarChart";
import { Dataset } from "../../models/charts/chartModels";

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ChartSectionProps {
  title: string;
  subtitle?: string;
  padding: number;
  data: {
    labels: string[];
    datasets: Dataset[];
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: NewBrandingColours.text.secondary,
  },
  chartWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: NewBrandingColours.text.secondary,
  },
});

function ChartSection({ title, subtitle, padding, data }: ChartSectionProps) {
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH);

  const onLayout = useCallback((event: any) => {
    const containerWidth = event.nativeEvent.layout.width;
    setChartWidth(containerWidth - padding * 2);
  }, [padding]);

  const renderLegend = () => (
    <View style={styles.legend}>
      {data.datasets.map((dataset, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: dataset.color() }]} />
          <Text style={styles.legendText}>{index}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.chartWrapper} onLayout={onLayout}>
        {chartWidth > 0 && (
          <BarChart
            width={chartWidth}
            height={200}
            data={data}
            labelColor={NewBrandingColours.text.muted}
          />
        )}
        {renderLegend()}
      </View>
    </View>
  );
};

export default ChartSection;