module.exports = {
  pwa: {
    manifestOptions: {
      "name": "Demo",
      "short_name": "Demo",
      "theme_color": "#4DBA87",
      "icons": [
        {
          "src": "./static/favicon/icons/icon_x16.png",
          "sizes": "16x16",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x32.png",
          "sizes": "32x32",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x48.png",
          "sizes": "48x48",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x72.png",
          "sizes": "72x72",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x96.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon_x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/icon-1024x1024.png",
          "sizes": "1024x1024",
          "type": "image/png"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x16.png",
          "sizes": "16x16",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x32.png",
          "sizes": "32x32",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x48.png",
          "sizes": "48x48",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x72.png",
          "sizes": "72x72",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x96.png",
          "sizes": "96x96",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x128.png",
          "sizes": "128x128",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x384.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon_x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "./static/favicon/icons/maskable_icon.png",
          "sizes": "1024x1024",
          "type": "image/png",
          "purpose": "maskable"
        },
      ],
      "start_url": ".",
      "display": "standalone",
      "background_color": "#000000"
    },
    name: 'Bogin',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    iconPaths: {
      favicon32: 'static/favicon/icons/icon_x16.png',
      favicon16: 'static/favicon/icons/icon_x32.png',
      appleTouchIcon: 'static/favicon/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'static/favicon/icons/msapplication-icon-144x144.png'
    },
    workboxPluginMode: 'GenerateSW',
  }
}