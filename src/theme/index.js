import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    workora: {
      navy: '#003B73', // Dark blue from logo
      turquoise: '#00F5D4', // Bright turquoise from logo
      white: '#FFFFFF',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'workora',
      },
      variants: {
        solid: (props) => ({
          bg: 'workora.navy',
          color: 'workora.white',
          _hover: {
            bg: 'workora.turquoise',
            color: 'workora.navy',
          },
        }),
        outline: {
          borderColor: 'workora.navy',
          color: 'workora.navy',
          _hover: {
            bg: 'workora.turquoise',
            color: 'workora.navy',
          },
        },
      },
    },
    Badge: {
      defaultProps: {
        colorScheme: 'workora',
      },
      variants: {
        solid: {
          bg: 'workora.navy',
          color: 'workora.white',
        },
        outline: {
          borderColor: 'workora.navy',
          color: 'workora.navy',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        color: 'workora.navy',
      },
    },
  },
});
