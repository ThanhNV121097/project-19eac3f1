# Moodboard — Apple IT

The owner gave no reference link, so the references are the galleries and the
sites they feature this year. Watched with `look_at`: load, every scroll step,
and what each page is built with.

## What I watched, and what I took

**Boc.Studio** — https://www.boc.studio/ (Lenis, 3 sticky elements, 2267px page)
A flat orange field fills the screen before anything else; the wordmark draws
in letter by letter, shrinks to nothing, and the work grid is already behind
it. A horizontal marquee strip sits pinned across the middle of the viewport
and keeps running while the grid scrolls under it.
**Taken:** the curtain intro that resolves into the page, and the pinned
marquee band that crosses the whole viewport while content moves past it.

**Nothing — Phone (3)** — https://www.nothing.tech/products/phone-3 (Lenis, 8062px page)
A single enormous product photograph, nearly monochrome, teal-grey, a person
holding the device in low light. No gradient, no glow, no card. The chrome of
the page is a floating pill bar, not a header bar. Mono type at small sizes
does all the labelling.
**Taken:** the hero that is one dark photograph and nothing else, the floating
pill navigation, and monospace as the labelling voice of the whole page.

**teenage.engineering** — https://teenage.engineering/ (no libraries, 15233px page)
Black product photography on pure black, each object lit by one hard light and
left to float with enormous empty space around it. The grid is a strict
left-aligned text column with the name of the thing set tiny in a corner.
Sections swap between white and black with no transition at all.
**Taken:** the one-light product photography on near-black, the tiny corner
label naming each object, and the hard white/black section cut.

**Land-book** — https://land-book.com/ (Inter, 2 sticky elements, 26 running animations on load)
A dense masonry wall of cards that fill in progressively as they enter the
viewport, each one arriving on its own beat rather than the row arriving at once.
**Taken:** the stagger — a grid whose cells arrive individually, not as a block.

**Awwwards** — https://www.awwwards.com/websites/ (Inter Tight, 5323px page)
Thumbnails hold an empty frame until they resolve, so the page's structure is
visible before its content is. The type is one tight grotesque at two sizes.
**Taken:** the frame-before-image reveal — a picture's box is drawn, then the
picture scales up inside it.

## The direction for Apple IT

This is a shop, not an agency, so the page has to show hardware and name it.
The direction is **a dark room with one light on each object**: the ground is
near-black graphite (`#0B0B0C`), the surface a shade above it, the ink a warm
off-white, and the one accent is a cold silver-blue (`#5E9BF0`) — the colour of
a screen waking in a dark room, used only on the active state and the thin
rules, never as a fill behind a headline. Nothing glows except the products.

The faces are two and they are clearly distinct: **Instrument Serif** sets the
display at enormous sizes with tight negative tracking, which is the unexpected
move here — every phone shop on the internet sets its headline in a geometric
sans, and a serif at 160px against a dark product photograph reads as a gallery
wall instead of a price list. **JetBrains Mono** carries every label, eyebrow,
spec row and price: storage sizes, chip names and warranty terms are technical
data, and mono is how technical data is set. Body copy is the mono's regular
weight at a generous line-height, kept under 70 characters.

The motion language is **one hard beat, then quiet answers**. On load, a
graphite curtain lifts off the hero photograph while the headline's lines clip
up one after another and the pill nav drops in — Boc.Studio's curtain, done in
grey instead of orange. After that nothing announces itself: the hero picture
parallaxes under the text, the product sections pin and stack so each device
holds the screen alone before the next slides over it (teenage.engineering's
one-object-at-a-time, choreographed), a mono marquee of the categories runs
pinned across the join, the spec table's rules draw themselves left to right,
and grid cells arrive on their own beat. Lenis carries the scroll. GSAP
ScrollTrigger drives the pins, SplitType the headline lines. `prefers-reduced-motion`
gets the page with everything in place and no scroll-tied movement at all.

## Crit notes

- Round 1 (1440 + 390): the stacked product sections were pinning but the type
  inside them sat too low against the picture; lifted the label block to the
  optical top of the frame and cut the stack's scroll distance so each device
  holds for about one screen rather than two.
- Round 2 (1440 + 390): the hero headline at 390 was wrapping to four lines and
  losing the serif's drama; dropped to two lines of larger type and moved the
  spec strip below the fold on phones.
- Round 3 (1440): the hero photograph was not visible at all — its frame sat at
  `-z-10`, behind the page's own ground colour, so the curtain lifted onto an
  empty black screen. Raised the frame to `z-0`, lifted the copy to `z-10`, and
  regenerated the hero picture with a real rim light on the titanium edge.
- Round 4 (1440 + 390): with the picture showing, the left edge of the frame
  cut a hard vertical seam down the middle of the hero. Re-graded the veil to a
  four-stop gradient so the photograph dissolves into the ground instead of
  ending at a line.
