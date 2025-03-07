import { writeFileSync, mkdirSync, existsSync, unlinkSync, copyFileSync } from 'fs';
import { resolve } from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const currentDir = __dirname;
const packageJsonPath = resolve(currentDir, `./package.json`);
const backupPackageJsonPath = resolve(currentDir, `./bk_package.json`);

async function main() {
  copyFileSync(packageJsonPath, backupPackageJsonPath);
  const argv = await yargs(hideBin(process.argv)).parse();
  if (!argv.project_name) {
    throw new Error('プロジェクト名を指定してください。');
  }
  const projectName = argv.project_name;
  const projectDir = resolve(currentDir, `./packages/${projectName}`);

  /**
   * packages直下にプロジェクト名のディレクトリを作成
   **/
  // 既に同じ名前のプロジェクトが存在する場合はエラーを投げる
  if (existsSync(projectDir)) {
    throw new Error('既に同じ名前のプロジェクトが存在します。');
  }
  // packages直下にsrcディレクトリを作成
  try {
    mkdirSync(resolve(projectDir, `./src`), { recursive: true });
  } catch (error) {
    console.log(error);
    throw new Error('ディレクトリの作成に失敗しました。');
  }

  /**
   * プロジェクト直下にREADMEを作成
   **/
  try {
    const content = `# はじめに\n\n-- ここに固有の情報（トリガや環境変数など）を記載する\n`;
    writeFileSync(resolve(projectDir, `./README.md`), content);
  } catch (error) {
    console.log(error);
    throw new Error('READMEの作成に失敗しました。');
  }

  /**
   * 作成したアプリの起点となるソースを作成
   **/
  try {
    const content = `console.log('${projectName}');\n`;
    writeFileSync(resolve(projectDir, `./src/main.ts`), content);
  } catch (error) {
    console.log(error);
    throw new Error('アプリの起点となるソースの作成に失敗しました。');
  }

  /**
   * プロジェクト直下に作成したアプリのpackage.jsonを作成
   **/
  try {
    const content = JSON.stringify(
      {
        name: projectName,
        version: '0.0.1',
        scripts: {
          'clasp-push': 'webpack && ncp appsscript.json dist/appsscript.json && clasp push'
        }
      },
      null,
      2
    );
    writeFileSync(resolve(projectDir, `./package.json`), content);
  } catch (error) {
    console.log(error);
    throw new Error('package.jsonの作成に失敗しました。');
  }

  /**
   * プロジェクト直下に作成したアプリのtsconfig.jsonを作成
   **/
  try {
    const content = JSON.stringify(
      {
        include: ['./src'],
        extends: '../../tsconfig.base.json'
      },
      null,
      2
    );
    writeFileSync(resolve(projectDir, `./tsconfig.json`), content);
  } catch (error) {
    console.log(error);
    throw new Error('tsconfig.jsonの作成に失敗しました。');
  }

  /**
   * プロジェクト直下に作成したアプリのwebpack.config.jsを作成
   **/
  try {
    const content =
      `const resolve = require('path').resolve;\n` +
      `    module.exports = {\n` +
      `      extends: resolve(__dirname, '../../webpack.config.base.js'),\n` +
      `      entry: resolve(__dirname, './src/main.ts')\n` +
      `    };\n`;
    writeFileSync(resolve(projectDir, `./webpack.config.js`), content);
  } catch (error) {
    console.log(error);
    throw new Error('webpack.config.jsの作成に失敗しました。');
  }

  /**
   * プロジェクト直下にclasp設定ファイルappsscript.jsonのタイムゾーンを日本に変更したものを作成し、元ファイルは削除する
   **/
  try {
    const appsScriptObject = require(resolve(currentDir, `./appsscript.json`));
    appsScriptObject.timeZone = 'Asia/Tokyo';
    const content = JSON.stringify(appsScriptObject, null, 2);
    writeFileSync(resolve(projectDir, `./appsscript.json`), content);
    unlinkSync(resolve(currentDir, `./appsscript.json`));
  } catch (error) {
    console.log(error);
    throw new Error('appsscript.jsonの作成、または削除に失敗しました。');
  }

  /**
   * プロジェクト直下にclasp設定ファイル.clasp.jsonのrootDirを./distに変更したものを作成し、元ファイルは削除する
   **/
  try {
    const claspObject = require(resolve(currentDir, `./.clasp.json`));
    claspObject.rootDir = './dist';
    const content = JSON.stringify(claspObject, null, 2);
    writeFileSync(resolve(projectDir, `./.clasp.json`), content);
    unlinkSync(resolve(currentDir, `./.clasp.json`));
  } catch (error) {
    console.log(error);
    throw new Error('.clasp.jsonの作成、または削除に失敗しました。');
  }

  /**
   * ルートディレクトリのpackage.jsonにアプリ名のスクリプト追加
   **/
  try {
    const packageObject = require(packageJsonPath);
    packageObject.scripts[`push:${projectName}`] = `npm run clasp-push --prefix ./packages/${projectName}`;
    const content = JSON.stringify(packageObject, null, 2);
    writeFileSync(packageJsonPath, content);
  } catch (error) {
    console.log(error);
    throw new Error('package.jsonの更新に失敗しました。');
  }
}

main()
  .catch((error) => {
    console.log(error);
    console.log('ファイル削除実行');
    unlinkSync(resolve(currentDir, `./appsscript.json`));
    unlinkSync(resolve(currentDir, `./.clasp.json`));
    copyFileSync(backupPackageJsonPath, packageJsonPath);
    console.log('失敗：プロジェクト作成');
  })
  .then(() => {
    console.log('成功：プロジェクト作成');
  })
  .finally(() => {
    unlinkSync(backupPackageJsonPath);
  });
