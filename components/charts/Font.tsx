import { matchFont } from '@shopify/react-native-skia';
import { Platform } from 'react-native';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'serif' });
const fontStyle = {
  fontFamily,
  fontSize: 12,
};

const DefaultChartFont = matchFont(fontStyle);

export default DefaultChartFont;
