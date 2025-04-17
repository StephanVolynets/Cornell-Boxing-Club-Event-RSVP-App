import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  colors: {
    maroon: {
      50: '#ffe2e2',
      100: '#ffb6b6',
      200: '#ff8989',
      300: '#ff5c5c',
      400: '#ff2f2f',
      500: '#e61616',
      600: '#b30e0e',
      700: '#810707',
      800: '#4f0202',
      900: '#1f0000',
    },
    darkBlue: {
      50: '#e6f1ff',
      100: '#bdd5f0',
      200: '#93b9e3',
      300: '#689dd7',
      400: '#3d81cb',
      500: '#2468b2',
      600: '#1a518b',
      700: '#103b65',
      800: '#07253f',
      900: '#00101a',
    },
  },
  styles: {
    global: props => ({
      body: {
        bg: props.colorMode === 'dark' ? '#1A202C' : 'gray.50',
        color: props.colorMode === 'dark' ? '#E2E8F0' : 'gray.800',
      }
    })
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'full',
      },
      variants: {
        solid: {
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
        },
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: 'full',
        px: 3,
        py: 1,
      },
      variants: {
        solid: props => ({
          bg: props.colorMode === 'dark' ? 'red.500' : 'red.500',
          color: 'white',
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          transition: 'all 0.2s ease-in-out',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Heading: {
      baseStyle: props => ({
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
    Text: {
      baseStyle: props => ({
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.700',
      }),
    },
    Modal: {
      baseStyle: props => ({
        dialog: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        },
      }),
    },
    Menu: {
      baseStyle: props => ({
        list: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          boxShadow: 'lg',
          zIndex: 1400,
          minW: '150px',
        },
        item: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
          },
          _focus: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
          },
        },
      }),
    },
    Popover: {
      baseStyle: props => ({
        content: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          boxShadow: 'xl',
          zIndex: 1400,
        },
      }),
    },
  },
  layerStyles: {
    menuContainer: {
      zIndex: 1400,
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
