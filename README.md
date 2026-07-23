# Jira Release Reporter

Jira export'larından (HTML / Excel / CSV) sürüm notu raporu üreten React + TypeScript uygulaması.

Canlı: https://isceptestekibi.github.io/Jira_Release_Reporter/

---

## Lokalde çalıştırma

**Gereksinim:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # sonra VITE_GEMINI_API_KEY değerini gir
npm run dev
```

### API anahtarı (opsiyonel — özellik henüz bağlı değil)

> **Durum:** `services/geminiService.ts` yazılmış ama hiçbir yerden import edilmiyor.
> AI özet özelliği şu an UI'a bağlı değil, dolayısıyla anahtar olmadan da uygulama tam çalışır.
> Aşağıdaki kurulum, özellik devreye alındığında geçerli olacak.

Proje kökünde `.env.local` dosyası:

```
VITE_GEMINI_API_KEY=senin-anahtarin
```

Anahtar: https://aistudio.google.com/apikey

Önek **`VITE_`** olmak zorunda — Vite yalnızca bu önekli değişkenleri tarayıcıya aktarır.
Anahtar build çıktısına gömülür, yani public deploy'da görünür olur; domain kısıtlı bir anahtar kullan.

---

## Branch yapısı

| Branch | İçerik | Elle düzenlenir mi |
|---|---|---|
| `main` | Kaynak kod | ✅ Tüm geliştirme burada |
| `gh-pages` | `dist/` build çıktısı | ❌ `npm run deploy` üretir |

> ⚠️ Repo'nun GitHub'daki **default branch'i `gh-pages`**. Yani `git clone` varsayılan
> olarak build çıktısını çeker, kaynak kodu değil. Kaynak için açıkça belirt:
>
> ```bash
> git clone -b main https://github.com/isceptestekibi/Jira_Release_Reporter.git
> ```
>
> Düzeltmek için (repo admin yetkisi gerekir):
> GitHub → Settings → General → Default branch → kalem ikonu → `main` seç → Update.
> Bu, GitHub Pages yayınını etkilemez; Pages ayarı ayrı olarak `gh-pages` branch'ini kullanmaya devam eder
> (Settings → Pages → Source: Deploy from a branch → `gh-pages` / root).

---

## Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run lint` | `tsc --noEmit` — tip kontrolü |
| `npm run test:parser` | Bug/Talep sınıflandırma kuralının regresyon testi |
| `npm run build` | `dist/` üretir |
| `npm run preview` | Build çıktısını lokalde servis eder |
| `npm run deploy` | Build alıp `gh-pages` branch'ine yayınlar |

`vite.config.ts` içindeki `base: '/Jira_Release_Reporter/'` GitHub Pages alt yolu için gereklidir; değiştirme.

---

## Proje yapısı

```
App.tsx                    Tüm UI ve state
index.tsx / index.css      Giriş noktası, Tailwind
types.ts                   Ortak tipler
version.ts, src/version.ts Sürüm bilgisi
services/
  htmlParser.ts            Jira HTML export parse
  excelParser.ts           Excel / CSV parse
  geminiService.ts         Gemini API çağrısı (şu an kullanılmıyor, bundle'a girmiyor)
```

Sürüm yükseltme akışı ve JQL referansları için `PRD.md` dosyasına bak.

---

## Notlar

- `node_modules/` ve `dist/` daha önce repoya commit edilmişti; artık `.gitignore` ile takip dışı.
  Clone sonrası mutlaka `npm install` çalıştır — commit edilmiş bağımlılıklar macOS'a özeldi.
- `@google/genai` bağımlılığı yüklü ama kullanılmıyor (bkz. `geminiService.ts`). Özellik
  devreye alınmayacaksa hem paket hem dosya silinebilir.
