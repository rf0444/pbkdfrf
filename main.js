async function generatePassword(userId, serviceDomain, iterations) {
  const encoder = new TextEncoder();
  const passwordKey = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(userId),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const salt = encoder.encode(serviceDomain);
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations,
      hash: 'SHA-256'
    },
    passwordKey,
    256
  );
  const byteArray = new Uint8Array(derivedBits);
  return btoa(String.fromCharCode(...byteArray));
}

document.getElementById("proc").addEventListener("click", async () => {
  const passEl = document.getElementById("pass");
  passEl.value = "";
  const sv = document.getElementById("sv").value;
  const user = document.getElementById("user").value;
  const iter = document.getElementById("iter").value - 0;
  const pass = await generatePassword(user, sv, iter);
  passEl.value = pass;
});
