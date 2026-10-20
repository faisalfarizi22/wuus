# WUUS · depth and motion V3

Owner brief, 20 October 2026: preserve WUUS DNA, use one footer, add authored depth/parallax, repair night contrast, and replace the gallery after pricing with grouped horizontal designs and velocity-responsive banking.

## Art direction

The homepage represents an independent digital studio, not a collection of identical panels. Navy, ivory and amber remain the material palette. Orbit linework comes from the existing WUUS globe/logo. Contrast in scale, generous space, actual website imagery and a darker service workspace give the page rhythm. No invented customers, business statistics, client testimonials or new sales promises.

## Motion thesis

- **Focal moment:** visitors steer a horizontal shelf of full website examples. Faster movement banks the previews farther; they settle upright at rest. Category controls travel through a fixed, genuinely grouped collection rather than swapping unrelated items.
- **Continuity:** hero orbit/globe, project stack, process image and footer horizon move at different restrained rates with native CSS view timelines. Static content remains the fallback. Vertical page scrolling is not globally intercepted.
- **Feedback:** keyboard, category buttons, arrows, wheel/touch, focus and active-category state remain explicit. Motion can be interrupted. Existing music/effects stay opt-in.
- **Budget:** no WebGL or additional animation dependency. Native scroll timelines for page parallax; bounded frame work only for the user-requested kinetic gallery interaction. No continuous JS page-scroll listener or idle animation loop. Reduced motion removes spatial parallax/banking; all links and category navigation remain available.

## Footer and night mode

The horizon closing becomes the single semantic footer outside `main`. Its directory retains homepage links, blog, English hospitality, email/WhatsApp, copyright, privacy and project terms. The older footer is retained for other routes but no longer rendered on the Indonesian experience homepage.

The service contrast defect came from later `nth-child` background rules overriding the earlier homepage row reset: row three kept a cream background behind night-mode ivory type. Scope the service workspace explicitly and keep surface/text pairs together. Verify computed colors, not only token names. Night surfaces use navy material/light planes with warm accents; readable text sits on a stable dark surface rather than a bright patch.

## Evidence

Source versions and final browser desktop/mobile checks are recorded in `outputs/studio-20261020-v3` and the local office artifact registry. No outreach, social upload, Telegram send, schedule restart or deployment is part of this task.
