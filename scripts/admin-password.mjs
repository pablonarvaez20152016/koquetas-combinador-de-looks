import { pbkdf2Sync, randomBytes, randomInt } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const password = Array.from({ length: 10 }, () => randomInt(10)).join('');
const salt = randomBytes(16).toString('hex');
const iterations = 310000;
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256').toString('hex');
await writeFile(new URL('../src/data/admin-access.json', import.meta.url), JSON.stringify({ salt, iterations, hash }, null, 2) + '\n');
await writeFile(new URL('../admin-access.txt', import.meta.url), `Acceso local de administración de Koquetas Boutique\nRuta: añade #/admin al final de la dirección de la aplicación.\nContraseña de 10 dígitos: ${password}\n\nEste archivo es privado: no lo subas a GitHub ni lo compartas con clientas.\nLa protección funciona en el navegador y no sustituye la autenticación de un servidor.\n`);
console.log('Contraseña generada. Consúltala en admin-access.txt; no se imprime en la terminal.');
