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
