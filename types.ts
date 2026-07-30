
export interface JiraTask {
  backlogId: string;
  summary: string;
  epicName: string;
  fixVersion: string;
  fixBuild: string;
  status: string;
  originalKey: string; // Added for platform detection (ISCEPANDROID/ISCEPIPHONE)
  statusCategoryChanged: string; // New field for reporting history info
  issueType: string; // New field to distinguish Bug vs Story
  externalRcId: string; // New field for ISCEPEXTRC-xxxx
  releaseNotes: string; // Release Notes field from Jira
  ccrspSummaryHint?: string; // If 'relates to' cell provides "CCRSP-1234 Summary Text", store "Summary Text" here
  linkedKeys?: string[]; // Bu kayda bağlı diğer bilet numaraları (ISCEPANDROID-123, CCRSP-456 ...).
                         // Kendi üstünde CCRSP olmayan hataların, bağlı olduğu kayıt üzerinden
                         // CCRSP'ye ulaşabilmesi için tutulur.
}

export interface ReportConfig {
  version: string;
  build: string;
  tasks: JiraTask[];
}

export enum ReportStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}