const APP_NAME = "Google Contacts to Calendar Sync";
const APP_VERSION = "1.1.0"
const APP_SOURCE_LINK = "https://github.com/sn00py1310/google-contacts-calendar-sync"

const APP_BANNER_LINES = [
    `${APP_NAME}`,
    `Version: ${APP_VERSION}`,
    `From: ${APP_SOURCE_LINK}`
]

const noYearDefaultYear = 1896; // To have leap year support
const SEARCH_INDICATOR_PREFIX = "CONTACTS_SYNC_SEARCH_INDICATOR=";
const syncTokenUpdateIntervall = 5;  // In days


const localFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
};


// Only change the configs below this line
const BIRTHDAY_TITLE = '{0} hat Geburtstag';
const localFormat = "de-DE";
