/* Handle jwk keyset generation */
import Jwk from 'rasha';
import debug from 'debug';
const provKeysetDebug = debug('provider:keyset');
class Keyset {
  /**
     * @description Handles the creation of jwk keyset.
     */
  static async build(Database, ENCRYPTIONKEY) {
    provKeysetDebug('Generating JWK keyset');
    const keys = (await Database.Get(ENCRYPTIONKEY, 'publickey')) || [];
    const keyset = {
      keys: []
    };
    for (const key of keys) {
      const jwk = await Jwk.import({
        pem: key.key
      });
      jwk.kid = key.kid;
      jwk.alg = 'RS256';
      jwk.use = 'sig';
      keyset.keys.push(jwk);
    }
    return keyset;
  }
}
export default Keyset;
//# sourceMappingURL=Keyset.js.map