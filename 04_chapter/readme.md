# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

### 必要であれば以下の手順を踏んでから、npm install を実行する
``` bash
# 1. npm キャッシュディレクトリの所有者を変更
bashsudo chown -R $(whoami) ~/.npm
# 2. npm キャッシュを完全に削除
bashrm -rf ~/.npm/_cacache

```

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## vite-plugin-glsl
### Shader(.glsl) を .js 上で扱うために vite-plugin-glsl をインストール
``` bash
npm i vite-plugin-glsl
```
### vite.config.js のプラグインの項目に以下を追加
``` vite.config.js
import glsl from 'vite-plugin-glsl';

// 中略

plugins:
    [
        restart({ restart: [ '../static/**', ] }), // Restart server on static file change
        glsl() // Handle shader files
    ],
```




