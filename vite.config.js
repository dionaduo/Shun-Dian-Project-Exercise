import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
                                plugins: [vue()], // 2. 使用插件
                              server: {
                                proxy: {
                                  '/api': {
                                    target: 'https://www.sundan.com',
                                    changeOrigin: true,
                                    rewrite: (path) => path.replace(/^\/api/, ''),
                                  },
                                },
                              },
                            });
