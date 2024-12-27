import { useCallback, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { NewBrandingColours } from "../../styles/brandingConstants";
import BarChart from "./BarChart";
import { Dataset } from "../../models/charts/chartModels";

const SCREEN_WIDTH = Dimensions.get('window').width;

interface ChartSectionProps {
  title: string;
  padding: number;
  data: {
    labels: string[];
    datasets: Dataset[];
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NewBrandingColours.text.primary,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: NewBrandingColours.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: NewBrandingColours.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: NewBrandingColours.text.primary,
    marginBottom: 10,
  },
});

function ChartSection({ title, padding,data }: ChartSectionProps) {
  const [chartWidth, setChartWidth] = useState(SCREEN_WIDTH);

  const onLayout = useCallback((event: any) => {
    const containerWidth = event.nativeEvent.layout.width;
    setChartWidth(containerWidth - padding * 2);
  }, []);

  return (
    <View style={[styles.chartContainer, { padding }]} onLayout={onLayout}>
      <Text style={styles.chartTitle}>{title}</Text>
      {chartWidth > 0 && (
        <BarChart width={chartWidth} height={200} data={data} />
      )}
    </View>
  );
};

export default ChartSection;