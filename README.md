# Google Contacts Calendar Sync

## Features
- Rate Limit efficient, only changes updated Contacts
- One-way synchronization from Google Contacts to Google Calendar
    - Sync contacts birthdays and events to your calendar

## Setup
### Installation
1. Go to the [latest release](./releases/latest) and download the .zip or .tar.gz file.
2. Create a Google App Script (GAS) Project [here](https://script.google.com).
3. Copy the content of the `src` folder in the downloaded release to the create GAS Project.
4. Create a [new calendar](https://calendar.google.com/calendar/r/settings/createcalendar) in Google Calendar and add in the description a indicator, so the script knows it is allowed to change this calendar.
5. Setup the project variables for the GAS Project under the settings, see [Setting](#settings).
6. Go to the main file and run the main method once, now you should get a pop-up to request access to your Contacts and Calendars.
7. In the GAS Project create a trigger for the function main. Set the repeating time to 4 hours.
8. See the contacts events sync to your calendar


### Settings
| Optional | Key | Value |
| --- | --- | --- |
| :x: | `calendarSearchIndicator` | The indicator to define on which calendars this script has access to. |

## Tricks
### Delete all events
If you want to delete all events created by this script, just delete the `syncToken` and `syncTokenIssued` from the script properties. Then the script deletes and recreates all the events.