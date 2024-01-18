# はじめに

Google Apps Script を管理するリポジトリです。  
「clasp」を使用しており、ローカルで typescript を用いて開発、デプロイすることができます。  
https://developers.google.com/apps-script/guides/clasp?hl=ja

# 前提条件

volta  
https://volta.sh/

jq  
https://jqlang.github.io/jq/

# 初期

```
npm i
```

# ログイン

```
npm run login
```

# プロジェクト追加時

```
npm run create-project --project_name={プロジェクト名}
```

# デプロイ

```
npm run push:{プロジェクト名}
```
