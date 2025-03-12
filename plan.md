# CommonJS から ESM への移行計画

## 現状分析

- プロジェクトは現在 CommonJS 形式で実装
- Node.js v12.13.0 以上をサポート
- Babel を使用してビルドを行っている
- 主要な依存関係:
  - Express
  - Mongoose
  - JSONWebToken
  - その他の Express 関連ミドルウェア

## 移行戦略

### 1. デュアルパッケージ対応の準備

```json
{
  "name": "ltijs",
  "type": "commonjs",
  "exports": {
    ".": {
      "require": "./dist/cjs/index.js",
      "import": "./dist/esm/index.js"
    }
  }
}
```

### 2. ディレクトリ構造の変更

```
ltijs/
├── src/
│   ├── cjs/  (既存のCommonJSコード)
│   └── esm/  (新規ESMコード)
├── dist/
│   ├── cjs/  (CommonJSビルド)
│   └── esm/  (ESMビルド)
```

### 3. 実装手順

1. **準備フェーズ**
   - [x] 既存のソースコードを `src/cjs` に移動
   - [x] ビルド設定の分離（CommonJS用とESM用）
   - [x] package.json の更新

2. **ESM実装フェーズ**
   - [x] `src/esm` ディレクトリの作成
   - [x] コードの移行:
     - [x] `require` → `import` の変換 (Utils/ ディレクトリ完了)
     - [x] `module.exports` → `export` の変換 (Utils/ ディレクトリ完了)
     - [x] `__dirname`, `__filename` の代替実装
     - [x] ファイル拡張子の `.js` → `.mjs` 変更

3. **ビルド設定の更新**
   - [x] Babel設定の分離
   - [x] npm scriptsの更新:
     ```json
     {
       "scripts": {
         "build:cjs": "babel src/cjs -d dist/cjs",
         "build:esm": "babel src/esm -d dist/esm",
         "build": "npm run build:cjs && npm run build:esm"
       }
     }
     ```

4. **テスト環境の整備**
   - [x] Vitestのインストールと設定
   - [x] CommonJSテストの移行
     - [x] 0-provider.test.mjs
     - [x] 1-lti.test.mjs
     - [x] 2-grade.test.mjs
     - [x] 3-deeplinking.test.mjs
     - [x] 4-namesandroles.test.mjs
     - [x] 5-dynamicregistration.test.mjs
     - [x] 6-close.test.mjs
   - [x] ESM用テストケースの作成
     - [x] ダイナミックインポート
     - [x] トップレベルawait
     - [x] import.meta.url
     - [x] CommonJS相互運用性
     - [x] ESM固有の制約

### 4. 品質管理

1. **テスト戦略**
   - [ ] CommonJS版のテスト実行
   - [ ] ESM版のテスト実行
   - [ ] 互換性テストの追加
   - [ ] E2Eテストの実施

2. **ドキュメント更新**
   - [ ] README.mdの更新
   - [ ] ESM版の使用方法の追加
   - [ ] 移行ガイドの作成

### 5. リリース計画

1. **アルファ版**
   - [ ] `@next` タグでのプレリリース準備
   - [ ] アルファ版のリリース
   - [ ] フィードバックの収集と分析

2. **ベータ版**
   - [ ] アルファフィードバックに基づく修正
   - [ ] パフォーマンステストの実施
   - [ ] ベータ版のリリース

3. **正式リリース**
   - [ ] 最終的なバグ修正
   - [ ] ドキュメントの最終確認
   - [ ] メジャーバージョンアップのリリース

## タイムライン

1. 準備フェーズ: 1週間
2. ESM実装フェーズ: 2週間
3. テスト環境整備: 1週間
4. 品質管理: 1週間
5. アルファ・ベータテスト: 2週間
6. 正式リリース: 1週間

合計予定期間: 約8週間

## 注意事項

- [ ] 下位互換性の確認
- [ ] Node.js のバージョンサポート範囲の見直し
- [ ] 依存パッケージのESM対応状況の確認
- [ ] TypeScript定義ファイルの更新

## リスク管理

1. **技術的リスク**
   - [ ] 依存パッケージのESM対応確認
   - [ ] Node.jsバージョン互換性テスト

2. **対策**
   - [ ] 依存パッケージの代替案リストの作成
   - [ ] バージョンテスト計画の策定
   - [ ] フォールバックメカニズムの設計 