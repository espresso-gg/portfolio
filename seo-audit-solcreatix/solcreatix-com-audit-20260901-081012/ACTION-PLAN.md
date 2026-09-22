# Action Plan

## Priority Queue

| Severity | Issue |
|----------|-------|
| Critical | Content: Author or expert attribution signals are limited or absent in the visible content. |
| Critical | Content: Word count (335) is below the recommended floor for a homepage (500). |
| Critical | Geo: Author/date attribution is weak in the visible content. |
| Critical | Geo: No llms.txt file was detected. |
| Critical | Geo: No strong 134-167 word self-contained answer block was detected. |
| Critical | Geo: Server-rendered content confirmation is weak without technical-cache support. |
| Critical | Geo: The page has limited question-based heading structure for AI extraction patterns. |
| Critical | Images: 10 image(s) use weak or filename-like alt text. |
| Critical | Images: 2 image(s) are missing width/height attributes. |
| Critical | Images: 2 image(s) exceed the 200KB warning threshold. |

## Recommended Actions

- **Technical**: Add baseline security headers such as CSP, HSTS, X-Frame-Options, and X-Content-Type-Options.
- **Technical**: Prioritize the hero/LCP element, reduce render-blocking resources, and compress above-the-fold assets.
- **Technical**: Reduce main-thread JavaScript work and defer non-critical third-party scripts.
- **Technical**: Consider IndexNow if faster Bing/Yandex discovery matters to the publishing workflow.
- **Performance**: Prioritize the hero/LCP element, reduce render-blocking resources, and compress above-the-fold assets.
- **Performance**: Reduce main-thread JavaScript work and defer non-critical third-party scripts.
- **Performance**: Provide `PAGESPEED_API_KEY` or re-run in an environment with PageSpeed API access for richer CWV evidence.
- **On Page**: Tighten the title tag so it stays in the 50-60 character band where possible.
- **Content**: Expand the page with more complete topical coverage, proof points, and supporting detail.
- **Content**: Add explicit author, founder, reviewer, or expert attribution where it fits the page type.
- **Schema**: Existing schema coverage is in reasonable shape. Focus on keeping values factual and server-rendered.
- **Images**: Replace generic alt text with concise content descriptions.
