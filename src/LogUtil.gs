class LogUtil {
  constructor() {
    this.logLevel = LogUtil.DEBUG;
    this.label = "";
  }

  setLogLevel(logLevel){
    this.logLevel = logLevel;
  }

  getLogLevel() {
    return LogUtil.logLevel; 
  }

  debug(msg, ...args){
    if (LogUtil.logLevel > LogUtil.DEBUG) return;
    console.log(`${this.label}[DEBUG]: ${msg}`, ...args);
  }

  log(msg, ...args){
    if (LogUtil.logLevel > LogUtil.log) return;
    console.log(`${this.label}[LOG]: ${msg}`, ...args);
  }

  info(msg, ...args){
    if (LogUtil.logLevel > LogUtil.INFO) return;
    console.log(`${this.label}[INFO]: ${msg}`, ...args);
  }

  warning(msg, ...args){
    if (LogUtil.logLevel > LogUtil.WARNING) return;
    console.log(`${this.label}[WARN]: ${msg}`, ...args);
  }

  error(msg, ...args){
    if (LogUtil.logLevel > LogUtil.ERROR) return;
    console.log(`${this.label}[ERROR]: ${msg}`, ...args);
  }

}

LogUtil.DEBUG = 100;
LogUtil.LOG = 200;
LogUtil.INFO = 300;
LogUtil.WARNING = 400;
LogUtil.ERROR = 500;
