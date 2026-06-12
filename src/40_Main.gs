function main(){
  let retry_count = 0;
  while (retry_count < 3){
    try {
      sync();
      return;
    } catch (error) {
      log.warning("Catched: " + error);
      if (
        error.name == "GoogleJsonResponseException"
        && error.message == "API call to people.people.connections.list failed with error: Sync token is expired. Clear local cache and retry call without the sync token.")
      {
        log.info("Catched a sync token expirer error, retrying without sync token");
        retry_count += 1;
        clearSyncToken();
      } else {
        throw error;
      }
    }
  }
}

function timerInvocation(){
  log.setLogLevel(LogUtil.INFO);
  main();
}
