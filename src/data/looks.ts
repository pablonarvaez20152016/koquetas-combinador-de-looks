import type { BlazerColor, LookCollection, PantColor } from '../types/look';
export const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
const soft = [['Rosa','Rosa empolvado'],['Verde oliva','Gris claro'],['Chocolate','Beige'],['Azul','Azul cielo'],['Rojo','Rojo'],['Malva','Camel']];
const cafe = [['Marfil','Rosa empolvado'],['Vino tinto','Negro'],['Malva','Rosa empolvado'],['Marfil','Beige'],['Negro','Rojo'],['Azul','Negro']];
function collection(id: PantColor, nombre: string, colorHex: string, palette: string[][]): LookCollection {
  return { id, categoria: 'pantalon', nombre, colorHex, imagenDesktop: `looks/${id}/desktop.webp`, looks: palette.map(([blusaColor, blazerColor], i) => ({ id: `${id}-${i+1}`, imagenMobile: `looks/${id}/mobile-${String(i+1).padStart(2,'0')}.webp`, blusaColor, blazerColor, pantalonColor: nombre, descripcion: `Pantalón ${nombre.toLowerCase()}, blusa ${blusaColor.toLowerCase()} y bléizer ${blazerColor.toLowerCase()}.` })) };
}
export const looks: LookCollection[] = [collection('negro','Negro','#242222',soft),collection('cafe-claro','Café claro','#b48a68',cafe),collection('vino-tinto','Vino tinto','#741d36',soft)];
const baseBlazerPalette = [['Marfil', 'Negro'], ['Rosa', 'Café claro'], ['Negro', 'Vino tinto'], ['Azul cielo', 'Negro'], ['Chocolate', 'Café claro'], ['Malva', 'Vino tinto']];
function blazerCollection(color: BlazerColor, nombre: string, colorHex: string, palette: string[][]): LookCollection {
  const id = `blazer-${color}` as const;
  return { id, categoria: 'blazer', nombre, colorHex, imagenDesktop: `looks/${id}/desktop.webp`, looks: palette.map(([blusaColor, pantalonColor], i) => ({
    id: `${id}-${i + 1}`, imagenMobile: '', blusaColor, pantalonColor, blazerColor: nombre,
    descripcion: `Bléizer ${nombre.toLowerCase()}, blusa ${blusaColor.toLowerCase()} y pantalón ${pantalonColor.toLowerCase()}.`,
  })) };
}
export const blazerLooks: LookCollection[] = [
  blazerCollection('blanco', 'Blanco', '#f1f0ed', baseBlazerPalette),
  blazerCollection('negro', 'Negro', '#242222', baseBlazerPalette.map((pair, i) => i === 2 ? ['Rojo', 'Vino tinto'] : pair)),
  blazerCollection('rojo', 'Rojo', '#bd1531', baseBlazerPalette.map((pair, i) => i === 2 ? ['Rojo', 'Negro'] : pair)),
  blazerCollection('rosado', 'Rosado', '#e7a5ad', [['Marfil', 'Negro'], ['Rosa', 'Café claro'], ['Beige', 'Vino tinto'], ['Malva', 'Negro'], ['Marfil', 'Café claro'], ['Malva', 'Vino tinto']]),
];
export const allLooks = [...looks, ...blazerLooks];
export const garmentCategories = [{ id: 'pantalon', nombre: 'Pantalón', habilitada: true }, { id: 'blusa', nombre: 'Blusa', habilitada: false }, { id: 'blazer', nombre: 'Bléizer', habilitada: true }] as const;
