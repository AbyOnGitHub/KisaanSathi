# Government Scheme Recommendation Frontend (`frontend-schemes`)

This is the standalone frontend application for discovering and applying for agricultural government schemes, subsidies, and grants.

---

## Features
- **Schemes Discovery (`SchemesPage.tsx`)**: Browse, filter, and search through eligible central and state schemes.
- **Scheme Details (`SchemeDetailPage.tsx`)**: Complete scheme breakdown with eligibility criteria, benefits, and required documents.
- **Application Flow (`ApplicationFormPage.tsx`, `ApplicationReviewPage.tsx`)**: Multi-step application submission.
- **Voice & Accessibility**: Integrated Text-to-Speech (`useTTS.ts`, `ListenButton.tsx`) and Voice Input (`VoiceInputButton.tsx`).
- **Multilingual Support**: English, Hindi, and Marathi via `LanguageContext.tsx`.

---

## How to Run

```bash
cd frontend/frontend-schemes
npm install
npm run dev
```

---

## Environment Variables (`.env`)
```env
VITE_SUPABASE_URL=https://pxzikfwejlncbwcrsujv.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```
