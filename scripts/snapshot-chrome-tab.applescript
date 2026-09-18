-- Snapshot of a logged-in tab in the person's own Chrome, without screen
-- recording: navigates the tab, runs anonymize-snapshot.js inside the page and
-- prints what it returns. Chrome must allow "JavaScript from Apple Events"
-- (View > Developer).
--
--   osascript scripts/snapshot-chrome-tab.applescript <host> <route> <seconds> <js-path> > page.html
--   node scripts/render-snapshot.mjs page.html page.png 1600 1000
on run argv
  set theHost to item 1 of argv
  set theRoute to item 2 of argv
  set theDelay to (item 3 of argv) as number
  set js to read (POSIX file (item 4 of argv)) as «class utf8»
  tell application "Google Chrome"
    set theTab to missing value
    repeat with w in windows
      repeat with t in tabs of w
        if URL of t contains theHost then
          set theTab to t
          exit repeat
        end if
      end repeat
      if theTab is not missing value then exit repeat
    end repeat
    if theTab is missing value then error "Nenhuma aba aberta em " & theHost
    if theRoute is not "" then
      set URL of theTab to ("https://" & theHost & theRoute)
      delay theDelay
    end if
    return execute theTab javascript js
  end tell
end run
