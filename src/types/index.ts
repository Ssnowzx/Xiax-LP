/** Shared type definitions for the Xiax site. */

export type FrontSlug = 'plataformas' | 'gestao' | 'automacao' | 'produtos'

/** The brand manual's loader variations, each with a meaning of its own. */
export type LoaderVariant = 'orbit' | 'orbit-step' | 'trail' | 'sequence' | 'grow' | 'dots' | 'pulse'

/** One of the four business fronts the umbrella brand signs. */
export interface Front {
  readonly slug: FrontSlug
  /** Label used in navigation and headings, pt-BR. */
  readonly name: string
  /** One sentence, no hype, describing what the client gets. */
  readonly promise: string
  /** The problem this front removes, phrased from the client's side. */
  readonly problem: string
  /** The manual assigns each loader a meaning; the front borrows the one that fits. */
  readonly loader: LoaderVariant
  /** Concrete things this front tends to contain. Words, not promises. */
  readonly examples: readonly string[]
}

/** A system is listed only when it exists. Pilots and mockups do not qualify. */
export type SystemState = 'production' | 'development'

export interface PortfolioItem {
  readonly slug: string
  readonly name: string
  /** Public address, when the system has one. */
  readonly url?: string
  /** Who signs the product. Xiax's own products can always be named. */
  readonly owner: 'xiax' | 'client'
  /** False until the client authorises being named on the site. */
  readonly clientNamed: boolean
  readonly front: FrontSlug
  /** One sentence: what the system does. */
  readonly summary: string
  /** Who it was built for, phrased as a situation, not a segment. */
  readonly forWhom: string
  /** What is actually in it. Only what is built. */
  readonly built: readonly string[]
  readonly stack: readonly string[]
  readonly state: SystemState
  /** ISO year or year-month the system entered production. Omit when unknown. */
  readonly since?: string
  /** Real screens of the system. Captured, never mocked. */
  readonly screens?: PortfolioScreens
}

export interface PortfolioScreens {
  /** Full screens of the real system, one per module, in landscape. */
  readonly screens: readonly PortfolioScreen[]
  /** Where the screens come from, shown beside them. */
  readonly source: string
  /** ISO date of the capture, shown beside the screens. */
  readonly capturedAt: string
  /**
   * What was replaced before publishing, when the real screens carried
   * personal data. Shown in the caption, so a real screen never pretends
   * to show real people.
   */
  readonly redacted?: string
}

export interface PortfolioScreen extends PortfolioImage {
  /** The module on screen, e.g. "Agenda". */
  readonly label: string
}

export interface PortfolioImage {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly alt: string
}

export interface MethodStep {
  readonly title: string
  readonly body: string
}

export interface ComparisonRow {
  readonly softwareHouse: string
  readonly businessHouse: string
}

export interface NavItem {
  readonly href: string
  readonly label: string
  /** Rendered as a button: the one action the header always offers. */
  readonly cta?: true
}

/** What the contact form sends. Validated with zod before it leaves the server. */
export interface ContactPayload {
  readonly name: string
  readonly email: string
  readonly company: string
  readonly front: FrontSlug | 'nao-sei'
  readonly message: string
}

/** Why the spam filter scored a message. Names are for the log and the webhook, never for the person. */
export type SpamReason =
  | 'too-fast'
  | 'no-timer'
  | 'link'
  | 'many-links'
  | 'link-in-identity'
  | 'markup'
  | 'foreign-script'
  | 'shouting'
  | 'sales-pitch'
  | 'heavy-pitch'
  | 'odd-name'
  | 'disposable-email'
  | 'repeated'

export interface SpamVerdict {
  /** ham is delivered, suspect is delivered flagged, spam is dropped and answered as sent. */
  readonly verdict: 'ham' | 'suspect' | 'spam'
  readonly score: number
  readonly reasons: readonly SpamReason[]
}

export type ContactResult =
  | { readonly status: 'idle' }
  | { readonly status: 'sent' }
  | { readonly status: 'invalid'; readonly errors: Readonly<Partial<Record<keyof ContactPayload, string>>> }
  | { readonly status: 'failed'; readonly reason: 'unconfigured' | 'rate-limited' | 'upstream' }

/** The six numbered parts of the sales page, in reading order. */
export type PageSectionId = 'servico' | 'metodo' | 'frentes' | 'no-ar' | 'motor' | 'contato'

export interface PageSection {
  readonly id: PageSectionId
  /** Short name, shown in the hero index, the section head and the header compass. */
  readonly name: string
  /** One sentence on what the reader finds there. */
  readonly brief: string
}
