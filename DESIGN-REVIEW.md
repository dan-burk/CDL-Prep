1. "Got it" / "Missed it" text fails AA (4.35:1, 4.42:1); "Start over" red on grey 4.31:1 → darken `--good` and `--bad` (now 5.2:1 or better everywhere).
2. Labels are ALL CAPS with wide tracking, which is hard to read with dyslexia → sentence case, semibold, normal tracking.
3. Shortcut list adds 2–3 extra rows under every card → list removed; each key shows inside its own button on desktop (Space, ←, →).
4. Card text leading-snug (1.375) on 30–36px is cramped; 30px on a phone gives ~17 letters per line → 28px phone / 36px desktop, 1.4 line height.
5. Home stats line packs 3–4 numbers ("12 of 120 learned · 5 to review · 30 new") → 2 numbers: "12 of 120 learned", "35 to study".
6. "Real test: 50 questions, need 80%" repeated 3 times, with a comma squeeze → "50-question test"; "Pass with 80%" said once in the footer.
7. Flat hierarchy: top bar title, page h1 and deck h2 all big and bold → top bar 18px semibold, h1 24/30px, h2 20px.
8. Focus ring is 30% blue (fails 3:1); segmented buttons have none → solid 2px accent ring with offset on every control.
9. Selected speed/read-aloud option is white-on-cream (1.1:1) and hard to spot → selected option is solid blue.
10. Done screen is centred, unlike every other screen → left-aligned.
11. Done copy is 19 words → "Nice work!", "First try: 15 of 20", "Missed cards come back first."
12. "Decks" in buttons vs "test" in the heading → one word: "test". "Back to decks" → "Back".
13. Top bar "CDL Prep · SD Class A": dot-separated, long title → "CDL Prep".
14. "Practice anyway" → "Practice".
15. ✗ / ✓ characters look different on every OS → SVG icons.
16. Study buttons (h-16, 20px) are oversized next to the h-12 home buttons → h-14 / 18px in the study bar, h-12 / 18px elsewhere.
17. Two speaker buttons in two styles with two labels ("Read this to me", "Read out loud") → one style, one label: "Read aloud".
18. Home speaker button only read 4 words → also reads the test names.
19. "Question" label on every card adds nothing → only "Try again" shows, when a card repeats.
20. Dashed 2px answer divider is noisy → 1px solid line.
21. Top bar is 3xl wide while study is 2xl, and its 12px padding doesn't match the 16px content padding → one max width, matching gutters, icons optically aligned.
22. Study height is calc(100dvh - 61px), a magic number → flex column layout.
23. 14px footer, page reference and voice note are too small → 16px minimum.
24. Footer has 13 words plus a link unrelated to the permit test → "Source: 2025 SD CDL Manual. Trust it over any card. Pass with 80%."
25. Reset buttons "Erase" / "Keep" are vague → "Erase all" / "Cancel". Speed option "Easy" sounds like a difficulty level → "Steady".
