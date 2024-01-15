#!/bin/sh
project_name=$1
now=$(date "+%Y%m%d%H%M%S")

# jqコマンドに依存しているのでコマンド存在チェックを行う
if !(type jq > /dev/null 2>&1); then
    echo 'jqコマンドがインストールされていません。'
    exit 1
fi

# packages配下にアプリ名のディレクトリを作成
mkdir -p ./packages/$project_name/src

# READMEの作成
echo "# はじめに\n\n-- ここに固有の情報（トリガや環境変数など）を記載する" > ./packages/$project_name/README.md

# packages配下に作成したアプリの起点となるソースを作成
echo "console.log('$project_name');" > ./packages/$project_name/src/main.ts

# packages配下に作成したアプリのpackage.jsonを作成
echo {} | jq '.name = "'$project_name'"' | \
    jq '.version = "0.0.1"' | \
    jq '.scripts = {"clasp-push":"clasp push"}' > ./packages/$project_name/package.json 

# clasp設定ファイルのタイムゾーンを日本に変更したものを作成
cat ./appsscript.json | jq '.timeZone|="Asia/Tokyo"' > ./${now}_appsscript.json

# clasp設定ファイルを削除
rm -f ./appsscript.json

# packages配下にclasp設定ファイルを移動
mv ./${now}_appsscript.json ./packages/$project_name/appsscript.json
mv ./.clasp.json ./packages/$project_name/.clasp.json

# ルートディレクトリのpackage.jsonにアプリ名のスクリプト追加
cat ./package.json | jq '.scripts|= .+ {"push:'$project_name'": "npm run clasp-push --prefix ./packages/'$project_name'"}' > ./${now}_package.json

# ルートディレクトリのpackage.jsonを置き換える
rm -f ./package.json
mv ./${now}_package.json ./package.json