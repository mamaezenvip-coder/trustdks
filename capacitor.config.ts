import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3c946242ccab41c9982273bd68704745',
  appName: 'Mamãe Zen',
  webDir: 'dist',
  server: {
    url: 'https://3c946242-ccab-41c9-9822-73bd68704745.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    },
    CapacitorMediaSession: {
      // Habilita controles de mídia no lockscreen e reprodução em background
      playIcon: 'media_play',
      pauseIcon: 'media_pause',
      stopIcon: 'media_stop'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_mamae_zen',
      iconColor: '#FF2D95',
      sound: 'default'
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#000000'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#000000',
    // Permite que o áudio continue tocando com a tela bloqueada / app em background
    limitsNavigationsToAppBoundDomains: false
  }
};

export default config;
