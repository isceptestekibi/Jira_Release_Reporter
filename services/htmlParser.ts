
import { JiraTask } from '../types';

export const parseJiraHtml = async (file: File): Promise<JiraTask[]> => {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  // Find the primary issue table
  const table = doc.querySelector('#issuetable') || doc.querySelector('table.aui') || doc.querySelector('table');
  if (!table) {
    throw new Error("HTML dosyasında uygun veri tablosu bulunamadı. Lütfen Jira'dan 'HTML (Current fields)' seçeneği ile çıktı aldığınızdan emin olun.");
  }

  // Extract headers to identify column indexes
  const headers = Array.from(table.querySelectorAll('thead tr th, tr:first-child th, tr:first-child td.searcherHeader'));

  const statusCategoryChangedIndex = headers.findIndex(h => {
    const txt = h.textContent?.toLowerCase().trim() || '';
    return txt.includes('status category changed') ||
      txt.includes('category changed') ||
      txt.includes('statü değişim tarihi');
  });



  const issueTypeIndex = headers.findIndex(h => {
    const txt = h.textContent?.toLowerCase().trim() || '';
    return txt.includes('issue type') || txt.includes('sorun tipi');
  });

  const labelsIndex = headers.findIndex(h => {
    const txt = h.textContent?.toLowerCase().trim() || '';
    return txt.includes('label') || txt.includes('etiket');
  });

  const releaseNotesIndex = headers.findIndex(h => {
    const txt = h.textContent?.toLowerCase().trim() || '';
    return txt.includes('release') || txt.includes('sürüm not');
  });

  // Extract rows, excluding those that are likely headers or empty
  let rows = Array.from(table.querySelectorAll('tbody tr, tr')).filter(r => {
    // A data row must have cells (td) and not be a header row
    return r.querySelector('td') && !r.querySelector('th');
  });

  if (rows.length === 0) {
    throw new Error("Tabloda veri satırı bulunamadı.");
  }

  const tasks: JiraTask[] = rows.map(row => {
    const cells = Array.from(row.querySelectorAll('td'));

    // Helper to safely extract text from a cell by class name or index
    const getText = (className: string): string => {
      const el = row.querySelector(`.${className}`);
      return el ? el.textContent?.trim() || '' : '';
    };

    const getByIndex = (idx: number): string => {
      if (idx === -1) return '';
      return cells[idx]?.textContent?.trim() || '';
    };

    const getInnerHtml = (className: string): string => {
      const el = row.querySelector(`.${className}`);
      return el ? el.innerHTML.trim() : '';
    };

    const getHtmlByIndex = (idx: number): string => {
      if (idx === -1) return '';
      return cells[idx]?.innerHTML.trim() || '';
    };

    // 1. Original Key (e.g. ISCEPANDROID-1234)
    const originalKey = getText('issuekey') || getText('key') || row.querySelector('.key')?.textContent?.trim() || getByIndex(headers.findIndex(h => h.textContent?.toLowerCase().includes('key'))) || 'N/A';

    // Issue Type
    let issueType = getText('issuetype');
    if (!issueType && issueTypeIndex !== -1) {
      issueType = getByIndex(issueTypeIndex);
    }
    // Fallback if extracting failed but row has typical bug markers? No, default to Story to be safe or keep empty.
    if (!issueType) issueType = 'Story';

    // 2. Backlog ID Logic (Prioritize CCRSP key)
    let backlogId = '-';
    let externalRcId = '-';
    let ccrspSummaryHint = '';

    // Search the ENTIRE row text to reliably capture linked issues 
    // regardless of the exact Jira column name they exported
    const allRowText = row.textContent || '';

    // Also look at all cells for a more precise match
    for (const cell of cells) {
      const txt = cell.textContent || '';
      const m = txt.match(/CCRSP[\s-]*\d+/i);
      if (m) {
        let matchStr = m[0].replace(/\s+/g, '').toUpperCase();
        if (!matchStr.includes('-')) matchStr = matchStr.replace('CCRSP', 'CCRSP-');
        backlogId = matchStr;
        
        const afterText = txt.substring(txt.indexOf(m[0]) + m[0].length).trim();
        if (afterText.length > 2) {
          ccrspSummaryHint = afterText.replace(/^[-:,]\s*/, '').split('ISCEP')[0].split('ISCOR')[0].trim();
        }
        break; // found the id and maybe the hint
      }
    }

    const extRcMatch = allRowText.match(/(ISCEPEXTRC|ISCOREXT)[\s-]*\d+/i);
    if (extRcMatch) {
      let m = extRcMatch[0].replace(/\s+/g, '').toUpperCase();
      if (!m.includes('-')) m = m.replace('ISCEPEXTRC', 'ISCEPEXTRC-').replace('ISCOREXT', 'ISCOREXT-');
      externalRcId = m;
    }

    // --- BUG SINIFLANDIRMA ---
    // PRD Kural B: Bir kayıt yalnızca şu durumlarda "Bug" sayılır:
    //   1. Issue Type'ı zaten Bug ise,
    //   2. ETİKETİNDE external / accessibilitybug geçiyorsa,
    //   3. Dış sistem bağlantısı (ISCEPEXTRC / ISCOREXT) varsa.
    // DİKKAT: Bu kontrol satırın tamamında değil, SADECE etiket hücresinde yapılır.
    // Aksi halde özetinde "bug" veya "external" kelimesi geçen her Story
    // yanlışlıkla "Tamamlanan Kayıtlar" tablosuna düşüyordu.
    const labelText = (getText('labels') || getByIndex(labelsIndex)).toLowerCase();

    if (issueType.toLowerCase() !== 'bug') {
      if (
        externalRcId !== '-' ||
        labelText.includes('accessibilitybug') ||
        labelText.includes('external')
      ) {
        issueType = 'Bug';
      }
    }

    // 2b. Bağlı bilet numaraları (Linked issues hücresi)
    // Kendi üstünde CCRSP olmayan bir hatanın, bağlı olduğu kayıt üzerinden CCRSP'ye
    // ulaşabilmesi için saklanır. Yalnızca link hücresi taranır; özet metnindeki
    // benzer ifadelerin yanlışlıkla bilet sayılmaması için satırın tamamı taranmaz.
    const linkCellText =
      getText('issuelinks') ||
      getByIndex(headers.findIndex(h => /link|bağlı|bagli/i.test(h.textContent || ''))) ||
      '';
    const linkedKeys = Array.from(
      new Set((linkCellText.match(/[A-Z][A-Z0-9]+-\d+/gi) || []).map(s => s.toUpperCase()))
    );

    // 3. Summary
    const summary = getText('summary') || getByIndex(headers.findIndex(h => h.textContent?.toLowerCase().includes('summary') || h.textContent?.toLowerCase().includes('özet'))) || 'N/A';

    // 4. Epic Name / Parent
    const epicName = getText('parent') || getText('customfield_10006') || getText('customfield_epic_link') || 'No Epic';

    // 5. Fix Version
    const fixVersion = getText('fixVersions') || 'Unscheduled';

    // 6. Fix Build
    const fixBuild = getText('customfield_10097') || getText('fixBuild') || 'General';

    // 7. Status
    const status = getText('status') || getByIndex(headers.findIndex(h => h.textContent?.toLowerCase().includes('status') || h.textContent?.toLowerCase().includes('durum'))) || 'Unknown';

    // 8. Status Category Changed
    let statusCategoryChanged = '';
    if (statusCategoryChangedIndex !== -1) {
      statusCategoryChanged = getByIndex(statusCategoryChangedIndex);
    } else {
      statusCategoryChanged = getText('updated') || '';
    }

    return {
      backlogId,
      summary,
      epicName,
      fixVersion,
      fixBuild,
      status,
      originalKey,
      statusCategoryChanged,
      issueType,
      externalRcId,
      ccrspSummaryHint,
      linkedKeys,
      releaseNotes: getInnerHtml('customfield_10082') || (releaseNotesIndex !== -1 ? getHtmlByIndex(releaseNotesIndex) : '')
    };
  });

  return tasks;
};