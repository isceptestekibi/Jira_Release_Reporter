/**
 * Parser regresyon testi — `npm run test:parser`
 *
 * Amaç: Bir kaydın "Talepler" mi yoksa "Tamamlanan Kayıtlar" (Bug) tablosuna mı
 * düşeceği kuralını korumak. Bu kural müşteriye giden raporu doğrudan etkilediği
 * için parser'a dokunulduğunda bu test mutlaka çalıştırılmalıdır.
 *
 * PRD Kural B: Bir kayıt yalnızca şu durumlarda Bug sayılır:
 *   1. Issue Type'ı Bug ise
 *   2. ETİKETİNDE external / accessibilitybug geçiyorsa
 *   3. Dış sistem bağlantısı (ISCEPEXTRC / ISCOREXT) varsa
 */
import { parseJiraExcel } from '../services/excelParser';
import { resolveCcrsp } from '../services/ccrspResolver';

// excelParser tarayıcı API'si olan FileReader'ı kullanıyor; Node'da minimal karşılığı.
class NodeFileReader {
  onload: any;
  onerror: any;
  result: any;
  readAsArrayBuffer(blob: any) {
    blob
      .arrayBuffer()
      .then((buf: ArrayBuffer) => {
        this.result = buf;
        this.onload({ target: { result: buf } });
      })
      .catch(() => this.onerror && this.onerror());
  }
}
(globalThis as any).FileReader = NodeFileReader;

const csv = [
  'Issue key,Issue Type,Summary,Status,Labels,Custom field (Fix Build #),Status Category Changed,Parent summary',
  'ISCEPANDROID-1,Story,"Login bug fix icin yeni ekran",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Giris',
  'ISCEPANDROID-2,Story,"External servis entegrasyonu",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Giris',
  'ISCEPANDROID-3,Story,"Para transferi ekrani",Approved,External-RC,10.10.0.1,22/Jul/26 10:00 AM,Transfer',
  'ISCEPANDROID-4,Bug,"Hesap listesi donmuyor",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Hesap',
  'ISCEPANDROID-5,Task,"Erisilebilirlik duzenlemesi",Approved,accessibilitybug,10.10.0.1,22/Jul/26 10:00 AM,Erisim',
].join('\n');

const cases: Array<[string, 'Talep' | 'Bug', string]> = [
  ['ISCEPANDROID-1', 'Talep', 'Ozetinde "bug" gecen Story, Bug sayilmamali'],
  ['ISCEPANDROID-2', 'Talep', 'Ozetinde "external" gecen Story, Bug sayilmamali'],
  ['ISCEPANDROID-3', 'Bug', 'Etiketi External olan kayit Bug sayilmali'],
  ['ISCEPANDROID-4', 'Bug', 'Issue Type Bug ise Bug sayilmali'],
  ['ISCEPANDROID-5', 'Bug', 'accessibilitybug etiketi Bug sayilmali'],
];

/**
 * 2. GRUP — CCRSP çözümleme (services/ccrspResolver.ts)
 *
 * Müşteri yalnızca CCRSP numaralarını görebiliyor. Bir hatanın CCRSP'si kendi
 * üstünde olmayabilir; bağlı olduğu kaydın üstünde olabilir. Gerçek örnek:
 * ISCEPANDROID-16142 -> bağlı ISCEPANDROID-15940 -> CCRSP-3529.
 */
const ccrspCsv = [
  'Issue key,Issue Type,Summary,Status,Labels,Custom field (Fix Build #),Status Category Changed,Parent summary,Outward issue link (Cloners)',
  'ISCEPANDROID-100,Story,"Ana ekran gelistirmesi",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Ana,CCRSP-500',
  'ISCEPANDROID-101,Bug,"Ana ekranda maskeleme hatasi",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Ana,ISCEPANDROID-100',
  'ISCEPANDROID-102,Bug,"Bagli kaydi olmayan hata",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Ana,',
  'ISCEPANDROID-103,Bug,"Kendi CCRSP\'si olan hata",Approved,,10.10.0.1,22/Jul/26 10:00 AM,Ana,CCRSP-600',
  'ISCEPANDROID-104,Bug,"Sadece dis kayda bagli hata",Approved,External,10.10.0.1,22/Jul/26 10:00 AM,Ana,ISCEPEXTRC-1329',
].join('\n');

const ccrspCases: Array<[string, string, string]> = [
  ['ISCEPANDROID-101', 'CCRSP-500', 'CCRSP bagli kayittan (Story) devralinmali'],
  ['ISCEPANDROID-102', '-', 'CCRSP yoksa bos (-) kalmali'],
  ['ISCEPANDROID-103', 'CCRSP-600', 'Kendi uzerindeki CCRSP kullanilmali'],
  ['ISCEPANDROID-104', '-', 'ISCEPEXTRC asla musteriye yazilmamali'],
];

const makeFile = (content: string) => {
  const f: any = new Blob([content], { type: 'text/csv' });
  f.name = 'test.csv';
  return f;
};

let failed = 0;
const report = (ok: boolean, line: string) => {
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${line}`);
};

parseJiraExcel(makeFile(csv))
  .then(tasks => {
    console.log('--- Bug / Talep siniflandirma ---');
    for (const [key, want, aciklama] of cases) {
      const task = tasks.find(t => t.originalKey === key);
      const got = task && task.issueType.toLowerCase() === 'bug' ? 'Bug' : 'Talep';
      report(got === want, `${key}  beklenen=${want} gelen=${got}  — ${aciklama}`);
    }
    return parseJiraExcel(makeFile(ccrspCsv));
  })
  .then(tasks => {
    console.log('\n--- CCRSP cozumleme (Defect ID) ---');
    for (const [key, want, aciklama] of ccrspCases) {
      const task = tasks.find(t => t.originalKey === key)!;
      const got = task ? resolveCcrsp(task, tasks) : 'KAYIT YOK';
      report(got === want, `${key}  beklenen=${want} gelen=${got}  — ${aciklama}`);
    }
    console.log(failed === 0 ? '\nTum testler gecti.' : `\n${failed} test basarisiz.`);
    process.exit(failed === 0 ? 0 : 1);
  })
  .catch(err => {
    console.error('Test calistirilamadi:', err);
    process.exit(1);
  });
