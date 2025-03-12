function _classPrivateFieldLooseBase(receiver, privateKey) { if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) { throw new TypeError("attempted to use private field on non-instance"); } return receiver; }
var id = 0;
function _classPrivateFieldLooseKey(name) { return "__private_" + id++ + "_" + name; }
/* Provider Dynamic Registration Service */
import got from 'got';
import crypto from 'crypto';
import _url from 'fast-url-parser';
import debug from 'debug';
import Objects from '../../Utils/Objects.js';
const provDynamicRegistrationDebug = debug('provider:dynamicRegistrationService');
var _name = /*#__PURE__*/_classPrivateFieldLooseKey("name");
var _redirectUris = /*#__PURE__*/_classPrivateFieldLooseKey("redirectUris");
var _customParameters = /*#__PURE__*/_classPrivateFieldLooseKey("customParameters");
var _autoActivate = /*#__PURE__*/_classPrivateFieldLooseKey("autoActivate");
var _useDeepLinking = /*#__PURE__*/_classPrivateFieldLooseKey("useDeepLinking");
var _logo = /*#__PURE__*/_classPrivateFieldLooseKey("logo");
var _description = /*#__PURE__*/_classPrivateFieldLooseKey("description");
var _hostname = /*#__PURE__*/_classPrivateFieldLooseKey("hostname");
var _appUrl = /*#__PURE__*/_classPrivateFieldLooseKey("appUrl");
var _loginUrl = /*#__PURE__*/_classPrivateFieldLooseKey("loginUrl");
var _keysetUrl = /*#__PURE__*/_classPrivateFieldLooseKey("keysetUrl");
var _getPlatform = /*#__PURE__*/_classPrivateFieldLooseKey("getPlatform");
var _registerPlatform = /*#__PURE__*/_classPrivateFieldLooseKey("registerPlatform");
var _ENCRYPTIONKEY = /*#__PURE__*/_classPrivateFieldLooseKey("ENCRYPTIONKEY");
var _Database = /*#__PURE__*/_classPrivateFieldLooseKey("Database");
var _buildUrl = /*#__PURE__*/_classPrivateFieldLooseKey("buildUrl");
var _getHostname = /*#__PURE__*/_classPrivateFieldLooseKey("getHostname");
class DynamicRegistration {
  constructor(options, routes, registerPlatform, getPlatform, ENCRYPTIONKEY, Database) {
    // Helper method to get the url hostname
    Object.defineProperty(this, _getHostname, {
      value: _getHostname2
    });
    // Helper method to build URLs
    Object.defineProperty(this, _buildUrl, {
      value: _buildUrl2
    });
    Object.defineProperty(this, _name, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _redirectUris, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _customParameters, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _autoActivate, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _useDeepLinking, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _logo, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _description, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _hostname, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _appUrl, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _loginUrl, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _keysetUrl, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _getPlatform, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _registerPlatform, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _ENCRYPTIONKEY, {
      writable: true,
      value: ''
    });
    Object.defineProperty(this, _Database, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldLooseBase(this, _name)[_name] = options.name;
    _classPrivateFieldLooseBase(this, _redirectUris)[_redirectUris] = options.redirectUris || [];
    _classPrivateFieldLooseBase(this, _customParameters)[_customParameters] = options.customParameters || {};
    _classPrivateFieldLooseBase(this, _autoActivate)[_autoActivate] = options.autoActivate;
    _classPrivateFieldLooseBase(this, _useDeepLinking)[_useDeepLinking] = options.useDeepLinking === undefined ? true : options.useDeepLinking;
    _classPrivateFieldLooseBase(this, _logo)[_logo] = options.logo;
    _classPrivateFieldLooseBase(this, _description)[_description] = options.description;
    _classPrivateFieldLooseBase(this, _hostname)[_hostname] = _classPrivateFieldLooseBase(this, _getHostname)[_getHostname](options.url);
    _classPrivateFieldLooseBase(this, _appUrl)[_appUrl] = _classPrivateFieldLooseBase(this, _buildUrl)[_buildUrl](options.url, routes.appRoute);
    _classPrivateFieldLooseBase(this, _loginUrl)[_loginUrl] = _classPrivateFieldLooseBase(this, _buildUrl)[_buildUrl](options.url, routes.loginRoute);
    _classPrivateFieldLooseBase(this, _keysetUrl)[_keysetUrl] = _classPrivateFieldLooseBase(this, _buildUrl)[_buildUrl](options.url, routes.keysetRoute);
    _classPrivateFieldLooseBase(this, _getPlatform)[_getPlatform] = getPlatform;
    _classPrivateFieldLooseBase(this, _registerPlatform)[_registerPlatform] = registerPlatform;
    _classPrivateFieldLooseBase(this, _ENCRYPTIONKEY)[_ENCRYPTIONKEY] = ENCRYPTIONKEY;
    _classPrivateFieldLooseBase(this, _Database)[_Database] = Database;
  }
  /**
   * @description Performs dynamic registration flow.
   * @param {String} openidConfiguration - OpenID configuration URL. Retrieved from req.query.openid_configuration.
   * @param {String} [registrationToken] - Registration Token. Retrieved from req.query.registration_token.
   * @param {Object} [options] - Replacements or extensions to default registration options.
   */
  async register(openidConfiguration, registrationToken, options = {}) {
    if (!openidConfiguration) throw new Error('MISSING_OPENID_CONFIGURATION');
    provDynamicRegistrationDebug('Starting dynamic registration process');
    // Get Platform registration configurations
    const configuration = await got.get(openidConfiguration).json();
    provDynamicRegistrationDebug('Attempting to register Platform with issuer: ', configuration.issuer);
    // Building registration object
    const messages = [{
      type: 'LtiResourceLinkRequest'
    }];
    if (_classPrivateFieldLooseBase(this, _useDeepLinking)[_useDeepLinking]) messages.push({
      type: 'LtiDeepLinkingRequest'
    });
    const registration = Objects.deepMergeObjects({
      application_type: 'web',
      response_types: ['id_token'],
      grant_types: ['implicit', 'client_credentials'],
      initiate_login_uri: _classPrivateFieldLooseBase(this, _loginUrl)[_loginUrl],
      redirect_uris: [..._classPrivateFieldLooseBase(this, _redirectUris)[_redirectUris], _classPrivateFieldLooseBase(this, _appUrl)[_appUrl]],
      client_name: _classPrivateFieldLooseBase(this, _name)[_name],
      jwks_uri: _classPrivateFieldLooseBase(this, _keysetUrl)[_keysetUrl],
      logo_uri: _classPrivateFieldLooseBase(this, _logo)[_logo],
      token_endpoint_auth_method: 'private_key_jwt',
      scope: 'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly https://purl.imsglobal.org/spec/lti-ags/scope/lineitem https://purl.imsglobal.org/spec/lti-ags/scope/score https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly',
      'https://purl.imsglobal.org/spec/lti-tool-configuration': {
        domain: _classPrivateFieldLooseBase(this, _hostname)[_hostname],
        description: _classPrivateFieldLooseBase(this, _description)[_description],
        target_link_uri: _classPrivateFieldLooseBase(this, _appUrl)[_appUrl],
        custom_parameters: _classPrivateFieldLooseBase(this, _customParameters)[_customParameters],
        claims: configuration.claims_supported,
        messages
      }
    }, options);
    provDynamicRegistrationDebug('Tool registration request:');
    provDynamicRegistrationDebug(registration);
    provDynamicRegistrationDebug('Sending Tool registration request');
    const registrationResponse = await got.post(configuration.registration_endpoint, {
      json: registration,
      headers: registrationToken ? {
        Authorization: 'Bearer ' + registrationToken
      } : undefined
    }).json();

    // Registering Platform
    const platformName = (configuration['https://purl.imsglobal.org/spec/lti-platform-configuration'] ? configuration['https://purl.imsglobal.org/spec/lti-platform-configuration'].product_family_code : 'Platform') + '_DynReg_' + crypto.randomBytes(16).toString('hex');
    if (await _classPrivateFieldLooseBase(this, _getPlatform)[_getPlatform](configuration.issuer, registrationResponse.client_id, _classPrivateFieldLooseBase(this, _ENCRYPTIONKEY)[_ENCRYPTIONKEY], _classPrivateFieldLooseBase(this, _Database)[_Database])) throw new Error('PLATFORM_ALREADY_REGISTERED');
    provDynamicRegistrationDebug('Registering Platform');
    const platform = {
      url: configuration.issuer,
      name: platformName,
      clientId: registrationResponse.client_id,
      authenticationEndpoint: configuration.authorization_endpoint,
      accesstokenEndpoint: configuration.token_endpoint,
      authorizationServer: configuration.authorization_server || configuration.token_endpoint,
      authConfig: {
        method: 'JWK_SET',
        key: configuration.jwks_uri
      }
    };
    const registered = await _classPrivateFieldLooseBase(this, _registerPlatform)[_registerPlatform](platform, _classPrivateFieldLooseBase(this, _getPlatform)[_getPlatform], _classPrivateFieldLooseBase(this, _ENCRYPTIONKEY)[_ENCRYPTIONKEY], _classPrivateFieldLooseBase(this, _Database)[_Database]);
    await _classPrivateFieldLooseBase(this, _Database)[_Database].Insert(false, 'platformStatus', {
      id: await registered.platformId(),
      active: _classPrivateFieldLooseBase(this, _autoActivate)[_autoActivate]
    });

    // Returing message indicating the end of registration flow
    return '<script>(window.opener || window.parent).postMessage({subject:"org.imsglobal.lti.close"}, "*");</script>';
  }
}
function _buildUrl2(url, path) {
  if (path === '/') return url;
  const pathParts = _url.parse(url);
  const portMatch = pathParts.pathname.match(/:[0-9]*/);
  if (portMatch) {
    pathParts.port = portMatch[0].split(':')[1];
    pathParts.pathname = pathParts.pathname.split(portMatch[0]).join('');
  }
  const formattedUrl = _url.format({
    protocol: pathParts.protocol,
    hostname: pathParts.hostname,
    pathname: (pathParts.pathname + path).replace('//', '/'),
    port: pathParts.port,
    auth: pathParts.auth,
    hash: pathParts.hash,
    search: pathParts.search
  });
  return formattedUrl;
}
function _getHostname2(url) {
  const pathParts = _url.parse(url);
  let hostname = pathParts.hostname;
  if (pathParts.port) hostname += ':' + pathParts.port;
  return hostname;
}
export default DynamicRegistration;
//# sourceMappingURL=DynamicRegistration.js.map