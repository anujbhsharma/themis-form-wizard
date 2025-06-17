const openpgp = require('openpgp');
const fs = require('fs');

async function decryptMessage(encryptedText, privateKeyArmored, passphrase) {
  // Read and decrypt the private key
  const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

  const readyKey = privateKey.isDecrypted()
  ? privateKey
  : await openpgp.decryptKey({ privateKey, passphrase });

  // Decrypt the message
  const message = await openpgp.readMessage({
    armoredMessage: encryptedText
  });

  const { data: decryptedText } = await openpgp.decrypt({
    message,
    decryptionKeys: readyKey
  });

  return decryptedText;
}

const encryptedText = `-----BEGIN PGP PRIVATE KEY BLOCK-----

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
=s3c9
-----END PGP PRIVATE KEY BLOCK-----`;

const privateKeyArmored = fs.readFileSync('privateKey.asc', 'utf8');

decryptMessage(encryptedText, privateKeyArmored, process.env.PASS_PHRASE)
  .then(decryptedText => {
    console.log('🔓 Decrypted message:');
    console.log(decryptedText);
  })
  .catch(err => {
    console.error('❌ Failed to decrypt:', err);
  });