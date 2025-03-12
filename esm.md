# ltijsのESMサポートについて

## 概要

ltijsライブラリはCommonJSとESM（ECMAScript Modules）の両方のモジュール形式をサポートしています。このドキュメントでは、ESMをどのように使用するか、また両方のモジュール形式を同時にサポートする方法について説明します。

## モジュール形式の違い

### CommonJS

```javascript
// モジュールのインポート
const ltijs = require('ltijs');

// モジュールのエクスポート
module.exports = someFunction;
```

### ESM

```javascript
// モジュールのインポート
import ltijs from 'ltijs';

// モジュールのエクスポート
export default someFunction;
```

## ファイル拡張子による区別

ltijsでは以下のファイル拡張子を使用してモジュール形式を区別しています：

- `.js` - `"type": "module"`設定により、ESMモジュールとして扱われる
- `.mjs` - 常にESMモジュールとして扱われる
- `.cjs` - 常にCommonJSモジュールとして扱われる

## ltijsの使い方

### CommonJSでの使用方法

```javascript
// CommonJSプロジェクトの場合
const ltijs = require('ltijs');

// または明示的にCommonJSバージョンを指定
const ltijs = require('ltijs/dist/cjs/index.cjs');
```

### ESMでの使用方法

```javascript
// ESMプロジェクトの場合
import ltijs from 'ltijs';

// または明示的にESMバージョンを指定
import ltijs from 'ltijs/dist/esm/index.js';
```

## プロジェクト構成

ltijsプロジェクトのモジュール構成は以下のとおりです：

- CommonJSビルド: `dist/cjs/**/*.cjs`
- ESMビルド: `dist/esm/**/*.js`

## 拡張子の重要性

Node.jsではファイル拡張子によってモジュールの扱いが異なります：

1. `package.json`に`"type": "module"`が設定されている場合:
   - `.js`ファイルはESMとして扱われる
   - `.cjs`ファイルはCommonJSとして扱われる
   - `.mjs`ファイルはESMとして扱われる

2. `"type": "module"`が設定されていない場合 (デフォルトはCommonJS):
   - `.js`ファイルはCommonJSとして扱われる
   - `.cjs`ファイルはCommonJSとして扱われる
   - `.mjs`ファイルはESMとして扱われる

## 開発上の注意点

1. **新しいファイルを追加する場合:**
   - CommonJSコードを書く場合は`.cjs`拡張子を使用
   - ESMコードを書く場合は`.js`または`.mjs`拡張子を使用

2. **依存関係の確認:**
   - CommonJSファイルからはCommonJSファイルのみをrequire()できる
   - ESMファイルからはESMファイルのみをimport()できる

3. **テスト実行:**
   - CommonJSテスト: `npm run test:cjs`
   - ESMテスト: `npm run test:mjs`
   - 両方のテスト: `npm test`

## トラブルシューティング

### 「Error [ERR_REQUIRE_ESM]」エラー

CommonJSファイル(`.cjs`)から`.js`ファイルを`require()`しようとしたときにこのエラーが発生する場合：

- インポート先のファイル拡張子が`.cjs`であることを確認する
- パスが正しいことを確認する
- `package.json`の設定を確認する

### 「SyntaxError: Cannot use import statement outside a module」エラー

`.js`ファイルで`import`文を使用したときにこのエラーが発生する場合：

- `package.json`に`"type": "module"`が設定されているか確認する
- ファイル拡張子を`.mjs`に変更する

## まとめ

ltijsは両方のモジュールシステムをサポートしており、適切なファイル拡張子と`package.json`の設定を使用することで、CommonJSとESMの両方のコードベースで問題なく動作します。

## コード例集

以下では、READMEやドキュメントから収集したコード例をESM形式で示します。

### 基本的なセットアップ

**CommonJS版:**

```javascript
const path = require('path')

// Require Provider 
const lti = require('ltijs').Provider

// Setup provider
lti.setup('LTIKEY', // Key used to sign cookies and tokens
  { // Database configuration
    url: 'mongodb://localhost/database',
    connection: { user: 'user', pass: 'password' }
  },
  { // Options
    appRoute: '/', loginRoute: '/login', // Optionally, specify some of the reserved routes
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: true // Set DevMode to false if running in a production environment with https
  }
)

// Set lti launch callback
lti.onConnect((token, req, res) => {
  console.log(token)
  return res.send('It\'s alive!')
})

const setup = async () => {
  // Deploy server and open connection to the database
  await lti.deploy({ port: 3000 }) // Specifying port. Defaults to 3000

  // Register platform
  await lti.registerPlatform({
    url: 'https://platform.url',
    name: 'Platform Name',
    clientId: 'TOOLCLIENTID',
    authenticationEndpoint: 'https://platform.url/auth',
    accesstokenEndpoint: 'https://platform.url/token',
    authConfig: { method: 'JWK_SET', key: 'https://platform.url/keyset' }
  })
}

setup()
```

**ESM版:**

```javascript
import path from 'path'

// Import Provider 
import { Provider as lti } from 'ltijs'

// Setup provider
lti.setup('LTIKEY', // Key used to sign cookies and tokens
  { // Database configuration
    url: 'mongodb://localhost/database',
    connection: { user: 'user', pass: 'password' }
  },
  { // Options
    appRoute: '/', loginRoute: '/login', // Optionally, specify some of the reserved routes
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: true // Set DevMode to false if running in a production environment with https
  }
)

// Set lti launch callback
lti.onConnect((token, req, res) => {
  console.log(token)
  return res.send('It\'s alive!')
})

const setup = async () => {
  // Deploy server and open connection to the database
  await lti.deploy({ port: 3000 }) // Specifying port. Defaults to 3000

  // Register platform
  await lti.registerPlatform({
    url: 'https://platform.url',
    name: 'Platform Name',
    clientId: 'TOOLCLIENTID',
    authenticationEndpoint: 'https://platform.url/auth',
    accesstokenEndpoint: 'https://platform.url/token',
    authConfig: { method: 'JWK_SET', key: 'https://platform.url/keyset' }
  })
}

setup()
```

### 静的ファイルの提供

**CommonJS版:**

```javascript
const lti = require('ltijs').Provider
const path = require('path')

// Setup
lti.setup(/* ... */)

// Add static path
lti.app.use('/public', lti.app.static(path.join(__dirname, 'public')))

// Add route for public-facing resources
lti.app.get('/resources', (req, res) => {
  res.send('Public resources')
})

// Deploy
lti.deploy({ port: 3000 })
```

**ESM版:**

```javascript
import { Provider as lti } from 'ltijs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup
lti.setup(/* ... */)

// Add static path
lti.app.use('/public', lti.app.static(path.join(__dirname, 'public')))

// Add route for public-facing resources
lti.app.get('/resources', (req, res) => {
  res.send('Public resources')
})

// Deploy
lti.deploy({ port: 3000 })
```

### Deep Linking サービスの利用

**CommonJS版:**

```javascript
const lti = require('ltijs').Provider

// Deep Linking callback
lti.onDeepLinking(async (token, req, res) => {
  const resource = {
    type: 'ltiResourceLink',
    title: 'Resource Title',
    url: 'https://tool.example.com/resource',
    custom: {
      key: 'value'
    }
  }
  
  // Create Deep Linking response message
  const message = lti.DeepLinking.createDeepLinkingMessage(token, [resource])
  
  // Return message in HTML form
  return res.send(lti.DeepLinking.createDeepLinkingForm(message))
})
```

**ESM版:**

```javascript
import { Provider as lti } from 'ltijs'

// Deep Linking callback
lti.onDeepLinking(async (token, req, res) => {
  const resource = {
    type: 'ltiResourceLink',
    title: 'Resource Title',
    url: 'https://tool.example.com/resource',
    custom: {
      key: 'value'
    }
  }
  
  // Create Deep Linking response message
  const message = lti.DeepLinking.createDeepLinkingMessage(token, [resource])
  
  // Return message in HTML form
  return res.send(lti.DeepLinking.createDeepLinkingForm(message))
})
```

### Assignment and Grades サービスの利用

**CommonJS版:**

```javascript
const lti = require('ltijs').Provider

// Main app route
lti.app.get('/', async (req, res) => {
  const token = res.locals.token
  
  // Get line items
  const lineItems = await lti.Grade.getLineItems(token)
  
  // Create line item
  const newLineItem = await lti.Grade.createLineItem(token, {
    scoreMaximum: 100,
    label: 'Grade',
    resourceId: 'resource',
    tag: 'tag'
  })
  
  // Submit score
  const score = await lti.Grade.submitScore(token, newLineItem.id, {
    userId: token.user,
    scoreGiven: 90,
    scoreMaximum: 100,
    comment: 'Great work!',
    timestamp: new Date().toISOString()
  })
  
  return res.send({
    lineItems,
    newLineItem,
    score
  })
})
```

**ESM版:**

```javascript
import { Provider as lti } from 'ltijs'

// Main app route
lti.app.get('/', async (req, res) => {
  const token = res.locals.token
  
  // Get line items
  const lineItems = await lti.Grade.getLineItems(token)
  
  // Create line item
  const newLineItem = await lti.Grade.createLineItem(token, {
    scoreMaximum: 100,
    label: 'Grade',
    resourceId: 'resource',
    tag: 'tag'
  })
  
  // Submit score
  const score = await lti.Grade.submitScore(token, newLineItem.id, {
    userId: token.user,
    scoreGiven: 90,
    scoreMaximum: 100,
    comment: 'Great work!',
    timestamp: new Date().toISOString()
  })
  
  return res.send({
    lineItems,
    newLineItem,
    score
  })
})
```

### Names and Roles サービスの利用

**CommonJS版:**

```javascript
const lti = require('ltijs').Provider

// Main app route
lti.app.get('/', async (req, res) => {
  const token = res.locals.token
  
  // Get course members
  const members = await lti.NamesAndRoles.getMembers(token)
  
  return res.send(members)
})
```

**ESM版:**

```javascript
import { Provider as lti } from 'ltijs'

// Main app route
lti.app.get('/', async (req, res) => {
  const token = res.locals.token
  
  // Get course members
  const members = await lti.NamesAndRoles.getMembers(token)
  
  return res.send(members)
})
```

### Dynamic Registration サービスの利用

**CommonJS版:**

```javascript
const lti = require('ltijs').Provider

// Register dynamic registration auto activate callback
lti.onDynamicRegistration((registration) => {
  // Auto activate all platforms registered through dynamic registration
  return true
})

// Deploy tool
lti.deploy({ port: 3000 })
```

**ESM版:**

```javascript
import { Provider as lti } from 'ltijs'

// Register dynamic registration auto activate callback
lti.onDynamicRegistration((registration) => {
  // Auto activate all platforms registered through dynamic registration
  return true
})

// Deploy tool
lti.deploy({ port: 3000 })
``` 