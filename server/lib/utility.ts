import { util } from 'chai';

export class Utility {
  public static env = (process.env.NODE_ENV || 'development').toLowerCase();

  static isProduction(): boolean {
    return this.env === 'production';
  }

  static verifyEnvironment() {
    const keys = [
      'DOMAIN',
      'COOKIE_SECRET',
      'JWT_SECRET',
      'ACCESS_TOKEN_EXPIRE_TIME',
      'DATABASE_URL',
    ];
    for (const key of keys) {
      if (!process.env[key]) throw new Error(`Missing ${key}`);
    }
  }

  static stringify(val): string {
    var stack = val.stack;

    if (stack) {
      return String(stack);
    }

    var str = String(val);

    return str === val.toString() ? util.inspect(val) : str;
  }

  static capitalize(str: string) {
    if (typeof str !== 'string') return str;

    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  static getObjectSlice(obj, keys: string[]) {
    return keys.reduce((acc, current) => {
      acc[current] = obj[current];
      return acc;
    }, {});
  }

  static apiRender(res, payload, status = 200) {
    res.status(status).send({
      status,
      payload,
      error: null,
    });
  }

  static createError(message, status = 400) {
    let error = message;
    if (!(error instanceof Error)) {
      error = new Error(message as string);
      error.appMessage = message;
    }
    error.status = status;
    return error;
  }

  static isObject(variable) {
    return Object.prototype.toString.call(variable) === '[object Object]';
  }
}
