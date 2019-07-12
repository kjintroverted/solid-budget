import { createMuiTheme } from '@material-ui/core/styles';

// https://material.io/tools/color/#!/?view.left=0&view.right=0&primary.color=0D47A1&secondary.color=FB8C00
export const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#002171',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#ffbd45',
      main: '#fb8c00',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#000000',
    },
    error: {
      main: '#ab47bc'
    },
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});