export { recordCardUsage, recordPhraseUsage, getFrequentCardsForNow, getCardsAfter, getCardFrequencyMap, getFrequentPhrases, getUsageSummary, getCurrentTimeSlot } from './usageStatsService.ts';
export type { BackupData } from './backupService.ts';
export { collectBackupData, exportBackup, importBackup, resetAllData } from './backupService.ts';
export { loadHistory, addToHistoryList, clearHistoryStorage } from './historyService.ts';
export { loadQuickPhrases, addPhrase, removePhrase, updatePhrase } from './quickPhraseService.ts';
