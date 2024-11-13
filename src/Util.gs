const properties = PropertiesService.getScriptProperties();

const maxDate = new Date(8640000000000000);
const minDate = new Date(-8640000000000000);
const noYearDefaultYear = 1900;
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
  return date.toISOString().split('T')[0]
}

function getDateFromSingleValues(day, month, year){
  let date = new Date();
  date.setDate(day);
  date.setMonth(month);

  date.setFullYear(noYearDefaultYear);
  if (year) date.setFullYear(year);
  return date;
}