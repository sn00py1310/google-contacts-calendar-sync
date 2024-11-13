const properties = PropertiesService.getScriptProperties();

const noYearDefaultYear = 1896; // To have leap year support
const localFormat = "de-DE";
const APP_NAME = "Google Contacts to Calendar Sync";
const SEARCH_INDICATOR_PREFIX = "CONTACTS_SYNC_SEARCH_INDICATOR=";


function getSyncToken(){
  let token = properties.getProperty("syncToken");
  if (token == undefined || token == null) return "";
  return token;
}

function setSyncToken(syncToken){
  properties.setProperty("syncToken", syncToken);
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

function testTMP(){
  console.log(formatDate(getDateFromSingleValues(3, 9, 2004)))
}