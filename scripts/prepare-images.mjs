import sharp from 'sharp';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const config = JSON.parse((await readFile(new URL('./images.config.json', import.meta.url), 'utf8')).replace(/^\uFEFF/, ''));
const manifest = [];
for (const item of config) {
  const source = path.join(root, 'fondos', item.source);
  const record = { id: item.id, available: false, width: 836, height: 941 };
  try {
    const { width, height } = await sharp(source).metadata();
    if (!width || !height || width % 2 !== 0) throw new Error('La panorámica necesita un ancho par para dos mitades idénticas.');
    record.width = width / 2;
    record.height = height;
    // La revisión visual es obligatoria: las dimensiones no detectan cuerpos cortados.
    if (!item.mobileApproved) {
      console.warn(`${item.id}: PENDIENTE. ${item.reason}`);
    } else {
      const out = path.join(root, 'public', 'looks', item.id);
      await mkdir(out, { recursive: true });
      if (item.generateDesktop) await sharp(source).webp({ quality: 88 }).toFile(path.join(out, 'desktop.webp'));
      for (let group = 0; group < 2; group++) {
        await sharp(source).extract({ left: group * record.width, top: 0, width: record.width, height })
          .webp({ quality: 88 }).toFile(path.join(out, `mobile-group-0${group + 1}.webp`));
      }
      record.available = true;
      console.log(`${item.id}: dos grupos ${record.width} × ${height}, misma escala y altura.`);
    }
  } catch (error) { console.warn(`${item.id}: PENDIENTE. ${error.message}`); }
  manifest.push(record);
}
// Los desktop existentes de pantalón no se modifican; solo se importan los nuevos autorizados.
await writeFile(path.join(root, 'src', 'data', 'mobile-images.json'), JSON.stringify(manifest, null, 2) + '\n');
