import { JiraTask } from '../types';

/**
 * Bir kaydın müşteriye gösterilecek CCRSP numarasını bulur.
 *
 * Neden gerekli: Müşterinin (banka) ISCEPEXTRC / ISCOREXT kayıtlarına erişimi yok,
 * yalnızca CCRSP numaralarını takip ediyor. Ancak bir hatanın CCRSP'si her zaman
 * kendi üstünde durmuyor; bazen bağlı olduğu kaydın (ör. ilgili Story) üstünde oluyor.
 *
 * Gerçek örnek: ISCEPANDROID-16142 kendi üstünde CCRSP taşımıyor, ama bağlı olduğu
 * ISCEPANDROID-15940 kaydının CCRSP-3529'u var. Doğru Defect ID: CCRSP-3529.
 *
 * Kurallar:
 *  1. Kaydın kendi CCRSP'si varsa o kullanılır.
 *  2. Yoksa bağlantılarına bakılır; bağlantı doğrudan bir CCRSP ise o kullanılır.
 *  3. Bağlı kayıt aynı export dosyasının içindeyse, onun CCRSP'si devralınır.
 *  4. Hiçbiri yoksa '-' döner (asla ISCEPEXTRC/ISCOREXT yazılmaz).
 *
 * Yalnızca TEK adım gidilir (zincir takip edilmez) ve bağlantı sırasındaki ilk CCRSP
 * kullanılır; böylece sonuç her çalıştırmada aynıdır.
 */
export function resolveCcrsp(task: JiraTask, allTasks: JiraTask[]): string {
  if (task.backlogId !== '-') return task.backlogId;

  for (const key of task.linkedKeys ?? []) {
    if (/^CCRSP-\d+$/i.test(key)) return key.toUpperCase();

    const linked = allTasks.find(
      t => t.originalKey && t.originalKey.toUpperCase() === key.toUpperCase()
    );
    if (linked && linked.backlogId !== '-') return linked.backlogId;
  }

  return '-';
}
