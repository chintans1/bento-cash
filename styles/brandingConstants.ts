// eslint-disable-next-line max-classes-per-file
class BrandingColours {
  // TODO: get rid of this
  static primaryColour = '#1B1B1B'; // '#171717'; // "#FCA311";

  static secondaryColour = '#2A77F1'; // '#219EBC'; // "#0B1215"; // "#14213D";

  static backgroundColour = '#FAFAFA'; // '#E5E5E5';

  static shadedColour = '#FEFEFE';

  static cardColour = '#FFFFFF';

  static borderColour = '#737373';

  static dividerColour = '#EFEFEF';

  static black = '#1B1B1B'; // '#171717';

  static red = '#D90429';

  static green = '#38B000';

  static grey = '#B8B8B8';

  static lightTextColour = '#FEFEFE';

  static darkTextAccentColor = '#2E2E2E';

  static darkTextColour = '#1B1B1B'; // "#2E2E2E" // '#171717';

  static header = BrandingColours.darkTextColour;
}

class NewBrandingColours {
  // Primary Colors
  static primary = {
    main: '#1A73E8', // Vibrant Blue
    light: '#4285F4', // Light Vibrant Blue
    dark: '#0D47A1', // Dark Vibrant Blue
  };

  // Secondary Colors
  static secondary = {
    main: '#00C853', // Vibrant Green
    light: '#69F0AE', // Light Vibrant Green
    dark: '#009624', // Dark Vibrant Green
  };

  // Accent Colors
  static accent = {
    purple: '#7C4DFF', // Vibrant Purple
    orange: '#FF6D00', // Vibrant Orange
    red: '#FF3D00', // Vibrant Red
    yellow: '#FFD600', // Vibrant Yellow
  };

  // Neutral Colors
  static neutral = {
    white: '#FFFFFF',
    background: '#F5F5F5',
    lightGray: '#E0E0E0',
    gray: '#9E9E9E',
    darkGray: '#616161',
    black: '#212121',
  };

  // Text Colors
  static text = {
    primary: '#212121',
    secondary: '#424242',
    muted: '#757575',
  };
}

export { BrandingColours, NewBrandingColours };
