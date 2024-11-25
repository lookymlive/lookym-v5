interface LogData {
  message: string;
  [key: string]: unknown;
}

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private static instance: Logger;
  private isProduction = process.env.NODE_ENV === 'production';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, data: LogData): string {
    const timestamp = new Date().toISOString();
    const { message, ...rest } = data;
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...rest
    });
  }

  private log(level: LogLevel, data: LogData): void {
    const formattedMessage = this.formatMessage(level, data);
    
    if (this.isProduction) {
      // In production, we might want to send logs to a service
      // TODO: Implement production logging service
      console.log(formattedMessage);
    } else {
      switch (level) {
        case 'info':
          console.log(formattedMessage);
          break;
        case 'warn':
          console.warn(formattedMessage);
          break;
        case 'error':
          console.error(formattedMessage);
          break;
        case 'debug':
          console.debug(formattedMessage);
          break;
      }
    }
  }

  info(data: LogData): void {
    this.log('info', data);
  }

  warn(data: LogData): void {
    this.log('warn', data);
  }

  error(data: LogData): void {
    this.log('error', data);
  }

  debug(data: LogData): void {
    if (!this.isProduction) {
      this.log('debug', data);
    }
  }

  // Auth specific logging methods
  authAttempt(userId: string, success: boolean, ip: string): void {
    this.info({
      message: `Authentication attempt`,
      userId,
      success,
      ip,
      event: 'auth_attempt'
    });
  }

  passwordReset(userId: string, ip: string): void {
    this.info({
      message: `Password reset requested`,
      userId,
      ip,
      event: 'password_reset'
    });
  }

  emailVerification(userId: string, success: boolean): void {
    this.info({
      message: `Email verification attempt`,
      userId,
      success,
      event: 'email_verification'
    });
  }

  accountLocked(userId: string, reason: string): void {
    this.warn({
      message: `Account locked`,
      userId,
      reason,
      event: 'account_locked'
    });
  }

  securityEvent(userId: string, event: string, details: unknown): void {
    this.warn({
      message: `Security event detected`,
      userId,
      event,
      details,
      eventType: 'security'
    });
  }
}

export const logger = Logger.getInstance();
