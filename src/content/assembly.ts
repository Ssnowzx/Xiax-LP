/**
 * "A operação, antes e depois": the pieces a company runs on today, and the
 * system they become. Geometry lives on the mark's 100-unit grid.
 *
 * Nine pieces. Four become satellites, one becomes the core, four disappear:
 * they were duplicates of each other, which is what a scattered operation is.
 */
export interface AssemblyPiece {
  readonly before: { readonly x: number; readonly y: number; readonly size: number; readonly label: string }
  readonly after: 'tl' | 'tr' | 'br' | 'bl' | 'core' | 'gone'
}

export const ASSEMBLY: readonly AssemblyPiece[] = [
  { before: { x: 3, y: 6, size: 12, label: 'planilha de clientes' }, after: 'tl' },
  { before: { x: 62, y: 3, size: 10, label: 'WhatsApp do dono' }, after: 'tr' },
  { before: { x: 84, y: 34, size: 12, label: 'ERP alugado' }, after: 'br' },
  { before: { x: 8, y: 66, size: 9, label: 'agenda no papel' }, after: 'bl' },
  { before: { x: 42, y: 44, size: 8, label: 'caixa no caderno' }, after: 'core' },
  { before: { x: 30, y: 16, size: 9, label: 'e-mail de pedidos' }, after: 'gone' },
  { before: { x: 66, y: 60, size: 11, label: 'ferramenta de disparo' }, after: 'gone' },
  { before: { x: 46, y: 80, size: 10, label: 'estoque em outra planilha' }, after: 'gone' },
  { before: { x: 86, y: 86, size: 8, label: 'fiado no caderno' }, after: 'gone' },
] as const

/** What each piece of the system is called once it exists. */
export const ASSEMBLY_AFTER_LABELS = {
  tl: 'cadastro',
  tr: 'agenda',
  br: 'financeiro',
  bl: 'atendimento',
  /** The wordmark, not "IA": on the site the centre is Xiax itself. */
  core: 'XIAX',
} as const
