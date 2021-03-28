const crypto = require("crypto");

const ENCRYPTION_ALGO = "aes-192-cbc";
const ENCRYPTION_PASSWORD = "helloworld";
const CRYPTION_ENCODING = 'hex';
const DELIMITER = '-';
const HASH_ALGO = 'sha256';
const HASH_ENCODING = 'hex';

class CryptUtils {
  static convertPasswordToHash(password) {
    if (typeof password === "string" && password.length > 0) {
      const hash = crypto.createHash(HASH_ALGO);
      hash.update(password);
      return hash.digest(HASH_ENCODING);
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }

  static encryptString(str) {
    if (typeof str === "string" && str.length > 0) {
      const key = crypto.scryptSync(ENCRYPTION_PASSWORD, "salt", 24);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(ENCRYPTION_ALGO, key, iv);
      const encrypted =
        cipher.update(str, "utf8", CRYPTION_ENCODING) + cipher.final(CRYPTION_ENCODING);
      return `${iv.toString(CRYPTION_ENCODING)}${DELIMITER}${encrypted}`;
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }

  static decryptString(encryptedString) {
    if (typeof encryptedString === "string" && encryptedString.length > 0) {
      encryptedString = encryptedString.split(DELIMITER);
      const iv = Buffer.from(encryptedString[0], CRYPTION_ENCODING);
      const encrypted = encryptedString[1];
      const key = crypto.scryptSync(ENCRYPTION_PASSWORD, "salt", 24);
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGO, key, iv);
      return (
        decipher.update(encrypted, CRYPTION_ENCODING, "utf8") + decipher.final("utf8")
      );
    } else {
      throw new TypeError("Provided value is not a valid string");
    }
  }
}

module.exports = CryptUtils;
