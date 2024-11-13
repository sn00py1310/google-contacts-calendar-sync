/**
 * Gets a list of people in the user's contacts.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list
 */
function getChangedPeople() {
  let nextPageToken = undefined;
  let peopleList = [];
  let nextSyncToken;

  do {
    const con = People.People.Connections.list('people/me', {
      personFields: 'metadata,names,events,birthdays', requestSyncToken: true, pageToken: nextPageToken, syncToken: getSyncToken()
    });

    nextPageToken = con.nextPageToken;
    // console.log("Page Token: " + con.nextPageToken)

    nextSyncToken = con.nextSyncToken;

    if(con.connections) peopleList = peopleList.concat(con.connections);
  } while (nextPageToken != undefined);

  if(!peopleList.length) console.log("No entities to sync found");

  let returnData = {"peopleList": peopleList}
  if (nextSyncToken) returnData["syncToken"] = nextSyncToken;
  // console.log("Sync Token: " + con.nextSyncToken)

  return returnData;
}


/**
 * Lists the calendars shown in the user's calendar list.
 * @see https://developers.google.com/calendar/api/v3/reference/calendarList/list
 */
function getAllowedCalendarIds() {
  let calendars;
  let pageToken;
  let allowedCalendars = [];

  do {
    calendars = Calendar.CalendarList.list({
      maxResults: 100,
      pageToken: pageToken

    });
    if (!calendars.items || calendars.items.length === 0) {
      console.log('No calendars found.');
      return allowedCalendars;
    }

    // Print the calendar id and calendar summary
    for (const calendar of calendars.items) {
      // console.log('%s (ID: %s)', calendar.summary, calendar.id, calendar.description);
      if(calendar.description?.includes(getCalendarIndicator())) allowedCalendars.push(calendar.id);
    }

    pageToken = calendars.nextPageToken;
  } while (pageToken);

  // console.log(allowedCalendars);
  return allowedCalendars;
}


function createSeriesForPerson(calendarId, person, search) {

  // console.log('Person dump: %s', JSON.stringify(person, null, 2))
  let personName = person.names[0].displayName;
  let personURI = "https://contacts.google.com/" + person.resourceName.replace(/^people\//,"person/");
  console.log('Create events for person: %s (%s)', personName, personURI);

  if (person.birthdays) {
    for (event of person.birthdays) {
      // console.log('Birthday: %s', JSON.stringify(person, null, 2))
      let personDate = event.date;
      let date = getDateFromSingleValues(personDate.day, personDate.month-1, personDate.year);
      let title = dynamicStringFormat('{0} hat Geburtstag', personName);
      let description = dynamicStringFormat('{0} \n\n\n\n{1}', date.toLocaleDateString(localFormat), search);

      createSeries(calendarId, date, title, description, personURI);
    }
  }


  if (person.events){
    for (event of person.events){
      // console.log('Event: %s', JSON.stringify(event, null, 2))

      let personDate = event.date;
      let date = getDateFromSingleValues(personDate.day, personDate.month-1, personDate.year);
      let title = dynamicStringFormat('{0}: {1}', event.formattedType ,personName);
      let description = dynamicStringFormat('{0} \n\n\n\n{1}', date.toLocaleDateString(localFormat), search);

      createSeries(calendarId, date, title, description, personURI);
    }
  }

}

function createSeries(calendarId, date, title, description, personURI){
  let startDate = new Date(date);
  let endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  let startDateFormatted = formatDate(startDate);
  let endDateFormatted = formatDate(endDate);
    
    
  let event = {
    "description": description,
    "start": {
      "date": startDateFormatted
    },
    "summary": title,
    "reminders": {
      "useDefault": false
    },
    "recurrence": [
      "RRULE:FREQ=YEARLY"
    ],
    "end": {
      "date": endDateFormatted
    },
    'transparency': 'transparent',
    'source': {
      'title': dynamicStringFormat("{0} on {1}", APP_NAME, formatDate(new Date())),
      'url': personURI
    }
  };

  let eventResponse = Calendar.Events.insert(event, calendarId);
  // console.log(JSON.stringify(eventResponse, null, 2));
}

function deleteForMultiple(calendarId, peopleList){
  let calendarSearch = SEARCH_INDICATOR_PREFIX
  let nextPageToken;

  do {
    response = Calendar.Events.list(calendarId, {'q': calendarSearch, pageToken: nextPageToken});
    nextPageToken = response.nextPageToken;

    console.log('Events found %s for search: %s on calendar %s', response.items.length, calendarSearch, calendarId); 
    
    for(person of peopleList){
      let search = SEARCH_INDICATOR_PREFIX + person.resourceName;
      console.log("For %s with search: %s", person.names[0].displayName, search);
      deleteEventsForUser(response.items, search)
    }
    console.log(nextPageToken);
  } while (nextPageToken)
}

function deleteEventsForUser(events, search){
  for(event of events){
    if(!event.description?.includes(search)) continue;


    if(event.recurringEventId && !deletedSeries.includes(event.recurringEventId)) {
      console.log("event.recurringEventId: %s", event.recurringEventId);
      Calendar.Events.remove(calendarId, event.id);

      deletedSeries.push(event.recurringEventId);
      console.log("Deleted series %s", event.recurringEventId);
      continue;
    }

    // console.log(event)
    Calendar.Events.remove(calendarId, event.id);
  }
}

function createForMultiple(calendarId, peopleList){
    for(person of peopleList){
      createForSingle(calendarId, person)
    }
}

function createForSingle(calendarId, person){
  let search = SEARCH_INDICATOR_PREFIX + person.resourceName;
  createSeriesForPerson(calendarId, person, search);
}

function deleteAndCreate(allowedCalendarIds, peopleList){
  for(calendarId of allowedCalendarIds){
    deleteForMultiple(calendarId, peopleList);  
    createForMultiple(calendarId, peopleList);
  }
}

function main(){

  let peopleListData = getChangedPeople();
  let peopleList = peopleListData.peopleList;

  // Get the list of connections/contacts of user's profile
  //console.log('Connections: %s', JSON.stringify(peopleList, null, 2));


  // Smaller sample size
  // peopleList = peopleList.filter((c) => c.names[0].displayName.includes("TEST"))
  // console.log(JSON.stringify(peopleList, null, 2))

  let allowedCalendarsIds = getAllowedCalendarIds();
  if(peopleList.length) deleteAndCreate(allowedCalendarsIds, peopleList);

  if (peopleListData.syncToken) setSyncToken(peopleListData.syncToken);
}
