#!/bin/bash

# 現在のpackage.jsonのバックアップを作成
cp package.json package.json.bak

# package.jsonから"type": "module"を削除してCommonJSテストを実行
cat package.json | sed '/"type": "module",/d' > package.json.tmp && mv package.json.tmp package.json
echo "Running CommonJS tests..."
npm run test:cjs

# "type": "module"を元に戻してESMテストを実行
cp package.json.bak package.json
echo "Running ESM tests..."
npm run test:mjs

# バックアップを削除
rm package.json.bak

echo "All tests completed." 