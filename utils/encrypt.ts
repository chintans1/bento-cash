import crypto from "crypto";

export class Encrypter {
  algorithm: string;
  key: string;
  iv: string;

  constructor(algorithm: string, encryptionKey: string, encryptionIv: string) {
    this.algorithm = algorithm;
    this.key = crypto.createHash('sha512').update(encryptionKey).digest('hex').substring(0, 32)
    this.iv = crypto.createHash('sha512').update(encryptionIv).digest('hex').substring(0, 16);
  }

  encrypt(clearText: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    return Buffer.from(cipher.update(clearText, "utf8", "hex") + cipher.final("hex")).toString("base64");
  }

  dencrypt(encryptedText: string): string {
    const encryptedBuffer = Buffer.from(encryptedText, "base64");
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    return decipher.update(encryptedBuffer.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
  }
}