/**
 * Anonymised snapshot of a logged-in system, taken inside the page.
 *
 * Runs in the browser tab (see snapshot-chrome-tab.applescript): clones the
 * rendered document, replaces every personal datum in the clone (names,
 * insurance card numbers, guide numbers, authorisation codes, the tenant's
 * name, long clinical notes) and returns the clone as HTML followed by the
 * original text, so render-snapshot.mjs can prove nothing survived. The live
 * page is never modified.
 *
 * For another system, adjust: BEFORE (tenant and user names), WHITE (UI
 * labels that look like a person's name) and UPPER_WHITE (labels in caps).
 */
(() => {
  const FIRST = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Heitor', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Priscila', 'Rafael', 'Sofia', 'Tiago', 'Valentina', 'William', 'Beatriz', 'Caio', 'Daniela', 'Eduardo', 'Fernanda', 'Gustavo', 'Helena', 'Igor', 'Júlia', 'Lucas', 'Mariana', 'Nicolas', 'Olívia', 'Pedro', 'Renata', 'Samuel', 'Tainá', 'Vitor', 'Yasmin', 'Arthur']
  const LAST = ['Almeida', 'Barbosa', 'Cardoso', 'Duarte', 'Esteves', 'Ferreira', 'Gomes', 'Henrique', 'Lima', 'Martins', 'Nogueira', 'Oliveira', 'Pereira', 'Ramos', 'Santos', 'Teixeira', 'Vieira', 'Xavier', 'Azevedo', 'Borges', 'Castro', 'Dias', 'Freitas', 'Guimarães', 'Lopes', 'Moreira', 'Nunes', 'Pinto', 'Rocha', 'Silva']
  const nameMap = new Map()
  let nameIndex = 0
  const fakeName = (original) => {
    const key = original.toLowerCase()
    if (!nameMap.has(key)) {
      const i = nameIndex++
      const words = original.trim().split(/\s+/).length
      const parts = [FIRST[(i * 13) % FIRST.length], LAST[(i * 7 + 3) % LAST.length]]
      if (words >= 3) parts.push(LAST[(i * 11 + 5) % LAST.length])
      nameMap.set(key, parts.join(' '))
    }
    let name = nameMap.get(key)
    if (original === original.toUpperCase()) name = name.toUpperCase()
    return name
  }
  const digitMap = new Map()
  const fakeDigits = (original) => {
    if (/^5000\d{4}$/.test(original)) return original
    if (!digitMap.has(original)) {
      let seed = 7
      for (const ch of original) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0
      const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return (seed >>> 16) % 10 }
      let idx = 0
      const keepPrefix = /^5014/.test(original)
      digitMap.set(original, original.replace(/\d/g, (d) => { const i = idx++; return keepPrefix && i < 4 ? d : String(rnd()) }))
    }
    return digitMap.get(original)
  }
  const WHITE = new Set(['Gestão de Convênios', 'Buscar Validade', 'Mostrar Histórico', 'Manual do Sistema', 'Mapa Mental', 'Clínica Teste', 'Clínica Modelo', 'Verificar Restrição', 'Nova Antecipação', 'Sua Clínica', 'Ver Todas', 'Ir Para', 'Tentar Novamente', 'Nova Clínica', 'Novo Convênio', 'Ler Pedido Médico', 'Pedido Médico', 'Última Consulta', 'Terapia Ocupacional', 'Psicoterapia Individual', 'SC Saúde', 'Sistema', 'Unimed', 'Celos', 'Pladisa', 'Particular', 'Gerar Conciliação', 'Abrir Conciliação', 'Importar Analítico', 'Importar Planilha', 'Nova Antecipação Manual', 'Antecipação Gerada', 'Aplicar Filtros', 'Limpar Filtros', 'Nenhuma Conciliação Encontrada', 'Ver Auditoria', 'Recepção', 'Administrador', 'Aline', 'Execuções Unimed', 'Sessões Autorizadas', 'Total Na Página', 'Página Atual', 'Status Ativo', 'Guias Na Página', 'Sessões Na Página', 'Data Sessão', 'Profissional Executante', 'Valor Unit', 'Valor Total', 'Repasse Total', 'Importado Em', 'Importado De', 'Importado Até', 'Na Página', 'Acesso Rápido', 'Saúde Do Sistema', 'Resumo Por Área', 'Últimas Alterações', 'Conciliação Financeira', 'Ver Guias', 'Nº Guia', 'Nº De Sessões', 'Lotes Importados', 'Arquivo Excel', 'Importar Analítico'])
  const CAP = '[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][a-záàâãéêíóôõúç]+'
  const INITIAL = '[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]\\.'
  const CONNECT = '(?:de|da|do|dos|das|e)'
  const NAME_RE = new RegExp(`^(?:${CAP}|${INITIAL})(?:\\s+(?:${CONNECT}|${CAP}|${INITIAL}))+\\.?$`)
  const UPPER_RE = /^[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]{2,}(?:\s+(?:DE|DA|DO|DOS|DAS|E|[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]{2,}))+$/
  const UPPER_WHITE = /PÁGINA|STATUS|SESS|CONSULTA|CLÍNICA|GUIA|VALOR|REPASSE|IMPORTADO|SAÚDE|ACESSO|RESUMO|ÚLTIMAS|CONCILIAÇÃO|DATA|HORA|PROFISSIONAL|TOTAL|FILTRO|ATENÇÃO|OPERAÇÃO|FILA|ARQUIVO|PLANILHA|TEXTO|CAMPO|LINHAS|AÇÕES|CONVÊNIO|ESPECIALIDADE|CARTEIRINHA|SENHA|VALIDADE|PACIENTE|MÉDICO|INFO|ITENS|QTD|ENTRADA|SAÍDA|EXECUTANTE|ACOMPANHANTE|RESUMO|NOVIDADES|AUDITORIA|RELATÓRIOS|CADASTR|SOLICITA|ADMINISTRA|MANUAL|AUTOMAÇ|EXECUÇ/
  const isName = (s) => s.length > 5 && !WHITE.has(s) && (NAME_RE.test(s) || (UPPER_RE.test(s) && !UPPER_WHITE.test(s)))
  const replaceNames = (text) => text.replace(/[^·\n|]+/g, (seg) => {
    const s = seg.trim()
    if (!s) return seg
    const m = s.match(/^(Dr\(a\)\.\s*|Dra?\.\s*)(.+)$/)
    if (m && isName(m[2])) return seg.replace(m[2], fakeName(m[2]))
    return isName(s) ? seg.replace(s, fakeName(s)) : seg
  })
  const BEFORE = [[/Rodrigo Ribeiro Madruga/g, 'Administrador'], [/NeuroKids/g, 'Clínica Modelo'], [/neurokids/g, 'clinica-modelo'], [/Pedido Médico: .+/g, 'Pedido Médico: pedido-medico.jpg'], [/Felipe B\. Fert/g, 'Equipe Xiax']]
  const AFTER = [[/\bMariana\b(?!\s+(?:dos|de|da)\b)/g, 'Recepção']]
  const CARTEIRINHA = /\b\d{4} \d{4} \d{6} \d{2} \d\b/g
  const LONG_NUMBER = /\b\d{8,11}\b/g
  const CID = /^[A-Z]\d{2}(?:\.\d)?\s+—\s+.+$/

  const clone = document.documentElement.cloneNode(true)
  clone.querySelectorAll('script, noscript').forEach((s) => s.remove())
  clone.querySelectorAll('[crossorigin]').forEach((el) => el.removeAttribute('crossorigin'))
  const live = document.querySelectorAll('canvas')
  clone.querySelectorAll('canvas').forEach((c, i) => {
    const src = live[i]
    const img = document.createElement('img')
    try { img.src = src.toDataURL('image/png') } catch { /* tainted */ }
    const r = src.getBoundingClientRect()
    img.width = Math.round(r.width)
    img.height = Math.round(r.height)
    img.setAttribute('style', c.getAttribute('style') || '')
    img.className = c.className
    c.replaceWith(img)
  })
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  const CHROME = 'th, label, h1, h2, h3, h4, nav, header, legend, summary, option'
  const inChrome = (node) => !!(node.parentElement && node.parentElement.closest(CHROME))
  const inRows = (node) => !!(node.parentElement && node.parentElement.closest('tbody, [role="row"]'))
  nodes.forEach((n) => {
    let t = n.textContent
    if (!t.trim()) return
    if (inChrome(n)) {
      for (const [re, rep] of BEFORE) t = t.replace(re, rep)
      if (t !== n.textContent) n.textContent = t
      return
    }
    if (inRows(n) && t.trim().length > 70 && !/^Solicitada em/.test(t.trim())) {
      n.textContent = 'Encaminhamento para acompanhamento terapêutico, conforme o pedido médico anexado.'
      return
    }
    for (const [re, rep] of BEFORE) t = t.replace(re, rep)
    if (CID.test(t.trim())) t = 'CID conforme o pedido médico'
    t = replaceNames(t)
    for (const [re, rep] of AFTER) t = t.replace(re, rep)
    t = t.replace(CARTEIRINHA, (m) => fakeDigits(m)).replace(LONG_NUMBER, (m) => fakeDigits(m))
    if (t !== n.textContent) n.textContent = t
  })
  clone.querySelectorAll('input').forEach((inp) => { if (!['checkbox', 'radio', 'submit', 'button'].includes(inp.type)) inp.removeAttribute('value') })
  clone.querySelectorAll('[title], [alt], [placeholder]').forEach((el) => { for (const a of ['title', 'alt']) { const v = el.getAttribute(a); if (v) el.setAttribute(a, replaceNames(v)) } })
  const base = document.createElement('base')
  base.href = location.origin + '/'
  clone.querySelector('head').prepend(base)
  return '<!DOCTYPE html>\n' + clone.outerHTML + '\n<!--ORIGINAL-INNERTEXT-->\n' + document.body.innerText
})()
