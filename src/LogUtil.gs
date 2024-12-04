class LogUtil {
  constructor() {
    this.logLevel = LogUtil.DEBUG;
    this.label = "";
  }

  setLogLevel(logLevel){
    this.logLevel = logLevel;
  }

  getLogLevel() {
    return this.logLevel; 
  }

  debug(msg, ...args){
    if (this.logLevel > LogUtil.DEBUG) return;
    console.log(`${this.label}[DEBUG]: ${msg}`, ...args);
  }

  log(msg, ...args){
    if (this.logLevel > LogUtil.log) return;
    console.log(`${this.label}[LOG]: ${msg}`, ...args);
  }

  info(msg, ...args){
    if (this.logLevel > LogUtil.INFO) return;
    console.log(`${this.label}[INFO]: ${msg}`, ...args);
  }

  warning(msg, ...args){
    if (this.logLevel > LogUtil.WARNING) return;
    console.log(`${this.label}[WARN]: ${msg}`, ...args);
  }

  error(msg, ...args){
    if (this.logLevel > LogUtil.ERROR) return;
    console.log(`${this.label}[ERROR]: ${msg}`, ...args);
  }

}

LogUtil.DEBUG = 100;
LogUtil.LOG = 200;
LogUtil.INFO = 300;
LogUtil.WARNING = 400;
LogUtil.ERROR = 500;
