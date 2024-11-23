class LogStore {
    private logs: Array<{ level: string; message: string; timestamp: Date; context: any }> = [];
  
    addLog(level: string, message: string, context?: any) {
      this.logs.push({ level, message, timestamp: new Date(), context });
    }
  
    query(filter: { level?: string; since?: Date; context?: any }) {
      return this.logs.filter(log => {
        if (filter.level && log.level !== filter.level) return false;
        if (filter.since && log.timestamp < filter.since) return false;
        if (filter.context && !this.matchesContext(log.context, filter.context)) return false;
        return true;
      });
    }
  
    private matchesContext(logContext: any, filterContext: any): boolean {
      for (const key in filterContext) {
        if (logContext[key] !== filterContext[key]) return false;
      }
      return true;
    }
  }
  