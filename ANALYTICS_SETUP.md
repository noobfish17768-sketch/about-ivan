# Analytics setup

This version includes centralized GA4 tracking for the portfolio.

## Tracked events

- `page_view` — GA4's standard page view
- `section_view` — meaningful sections entering the viewport
- `section_click` — in-page navigation clicks
- `project_click` — project/case-study card clicks
- `case_study_view` — case-study page opened
- `click_whatsapp`
- `click_email`
- `click_linkedin`
- `click_github`
- `cta_click`
- `outbound_click`
- `file_download`
- `scroll_depth` — 25%, 50%, 75%, 90%
- `engagement_milestone` — 30s, 60s, 120s
- `campaign_visit` — UTM source/medium/campaign/content

The Measurement ID is centralized in `js/analytics.js`.

## Deployment

1. Replace your current website files with this folder's contents.
2. Commit/push to the GitHub repository connected to Vercel.
3. Wait for Vercel deployment.
4. Open the website in a new/incognito window.
5. In GA4, open **Reports → Realtime** and interact with the site.
6. For custom events, open **Reports → Engagement → Events** after data has arrived.

## Important

Do not put personal data such as email addresses, phone numbers, names entered into forms, or message contents into GA4 event parameters. Review your privacy/cookie notice and any consent requirements that apply to your visitors before using analytics.
