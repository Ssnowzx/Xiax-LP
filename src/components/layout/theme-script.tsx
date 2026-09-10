/**
 * Runs before paint so the first-visit splash is on screen from the very
 * first frame, and the hero mark waits for it.
 */
const THEME_SCRIPT =
  "(function(){var d=document.documentElement;try{if(!sessionStorage.getItem('xiax-seen')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('has-splash');d.style.setProperty('--wait','2240ms')}}catch(e){}})()"

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
}
