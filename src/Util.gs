const properties = PropertiesService.getScriptProperties();

const noYearDefaultYear = 1896; // To have leap year support
const localFormat = "de-DE";
const APP_NAME = "Google Contacts to Calendar Sync";
const SEARCH_INDICATOR_PREFIX = "CONTACTS_SYNC_SEARCH_INDICATOR=";
const syncTokenUpdateIntervall = 5;

const log = new LogUtil();
log.setLogLevel(LogUtil.INFO);

function getSyncToken(){
  let token = properties.getProperty("syncToken");
  if (token == undefined || token == null) return "";
  return token;
}

function getSyncTokenIssued(){
  let token = properties.getProperty("syncTokenIssued");
  if (token == undefined || token == null || token == "") return 0;
  return token;
}

function setSyncToken(syncToken){
  let oldSyncToken = getSyncToken();
  if (syncToken === oldSyncToken) return;

  properties.setProperty("syncToken", syncToken);
  properties.setProperty("syncTokenIssued", Date.now());
}

function getCalendarIndicator(){
  let indicator = properties.getProperty("calendarSearchIndicator");
  if (indicator == undefined || indicator == null) return Utilities.getUuid().toString();
  return indicator;
}

function dynamicStringFormat(template, ...args){
  return template.replace(/{(\d+)}/g, (match, index) => args[index]);
}

function formatDate(date){
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

function getDateFromSingleValues(day, month, year){
  let date = new Date();
  date.setFullYear(noYearDefaultYear);
  if (year) date.setFullYear(year);
  date.setMonth(month);
  date.setDate(day);

  return date;
}

function isSyncTokenToOld(syncTokenIssued){
  return Date.now() - syncTokenIssued > syncTokenUpdateIntervall*24*60*60*1000
}
