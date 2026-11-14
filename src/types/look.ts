export type PantColor = 'negro' | 'cafe-claro' | 'vino-tinto';
export type BlazerColor = 'blanco' | 'negro' | 'rojo' | 'rosado';
export type GarmentCategory = 'pantalon' | 'blusa' | 'blazer';
export interface Look { id: string; imagenMobile: string; blusaColor: string; blazerColor: string; pantalonColor?: string; descripcion: string }
export interface LookCollection { id: PantColor | `blazer-${BlazerColor}`; categoria: 'pantalon' | 'blazer'; nombre: string; colorHex: string; imagenDesktop: string; looks: Look[] }
