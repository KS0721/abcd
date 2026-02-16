import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ks0721.aac',
  appName: '올인원 AAC',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#D45A00',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
    Haptics: {
      selectionDuration: 30,
    },
  },
  android: {
    backgroundColor: '#FFFFFF',
    allowMixedContent: false,
    overScrollMode: 'never',
  },
  ios: {
    backgroundColor: '#FFFFFF',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
};

export default config;
