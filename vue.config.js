const { defineConfig } = require('@vue/cli-service');

module.exports = {
  devServer: {
    port: 8085, // frontend portun
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Spring Boot backend portun
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' },
      },
    },
  },
};
