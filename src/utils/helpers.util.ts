import { config } from 'dotenv';
import { Logger } from 'tslog';
import { HTTP_INTERNAL_SERVER_ERROR } from './constants.util';
import * as bcrypt from 'bcryptjs';

config();

export const toBcrypt = (password: string): Promise<string> => {
  const round = parseInt(process.env.BCRYPT_ROUND ?? '12');
  return bcrypt.hash(password, round);
};

export const generateLog = (params: object, isError: boolean = false) => {
  const log = new Logger();
  if (isError) {
    log.error('ERROR: ', JSON.stringify(params, null, 2));
  } else {
    log.info('LOGS: ', JSON.stringify(params, null, 2));
  }
};

export const createResponse = (result: string, statusCode: number) => {
  return { result, statusCode };
};

export const errorResponse = (
  result: string,
  statusCode: number = HTTP_INTERNAL_SERVER_ERROR,
) => {
  return { result, statusCode };
};

export const generateIndex = (
  key: string,
  companyPrefix: string,
  isMongoDB: boolean = false,
): string => {
  let index = `${process.env.INDEX_PREFIX}_bpm_${key}_${companyPrefix}`;

  if (isMongoDB) {
    index = `${process.env.INDEX_PREFIX}_bpm_${companyPrefix}_${key}`;
  }

  return index;
};

type LogLevel = 'ERROR' | 'INFO' | 'SERVER';

export const saveLog = async (
  level: LogLevel,
  details: any,
  fnName: string,
  companyPrefix: string = 'generic',
): Promise<void> => {
  const app = process.env.APP_NAME;
  const log = {
    level: level,
    companyPrefix: companyPrefix,
    app: app,
    fn: fnName,
    ...(level === 'ERROR'
      ? { message: escapeSpecialChars(details.message) }
      : { event: safeStringify(details) }),
  };

  if (level === 'ERROR') {
    generateLog(log, true);
  }

  if (level === 'INFO') {
    generateLog(log);
  }
};

const escapeSpecialChars = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9_.=\s]/g, '');
};

export const safeStringify = (obj: any): string => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  });
};
