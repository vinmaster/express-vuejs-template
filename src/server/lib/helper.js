const JWT_EXPIRES_IN = '7d'; // 7 days
const app = require('express')();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const Helper = {
  // Success JSON
  renderSuccessJson(res, payload) {
    return res.json({
      status: 200,
      error: null,
      payload,
    });
  },

  // Function for creating Error object
  createError(message, status = 400) {
    let err = message;
    if (!(message instanceof Error)) {
      err = new Error(message);
      err.appError = message;
    }
    err.status = status;
    return err;
  },

  digestError(error) {
    if (!(error instanceof Error)) {
      error = Helper.createError(error);
    }
    const status = error.status || 500;
    let message = error.appError || 'Something went wrong';
    if (status === 500) {
      message = 'Internal server error';
    }
    const info = ['development', 'test'].includes(Helper.env) ? Helper.stringify(error.stack) : error.message;
    return {
      status,
      message,
      info,
      error,
    };
  },

  asyncWrap(fn) {
    if (arguments.length <= 3) {
      return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
        // fn(req, res, next).catch(next);
      };
    }
    return (err, req, res, next) => {
      Promise.resolve(fn(err, req, res, next)).catch(next);
    };
  },

  isAjax(req) {
    return req.xhr || req.headers.accept.includes('json');
  },

  skipReq(req, _res) {
    return req.url === '/dashboard' || req.url === '/admin';
  },

  verifyParams(query, ...params) {
    const errors = [];
    for (const param of params) {
      // Object.prototype.hasOwnProperty.call(query, param)
      if (!query[param]) {
        errors.push(param);
      }
    }
    return errors;
  },

  verifyParamsBang(query, ...params) {
    const missingParams = Helper.verifyParams(query, ...params);
    if (missingParams.length !== 0) {
      throw Helper.createError(`Missing ${missingParams.join(', ')}`);
    }
  },

  updateObjectWithSource(object, source, {
    allowed: attributes = Object.keys(source),
  } = {}) {
    for (const key of attributes) {
      if (source[key] !== undefined) {
        object[key] = source[key];
      }
    }
  },

  jwtSign(payload, expiresIn = JWT_EXPIRES_IN) {
    // Generate token
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  },

  jwtVerify(token) {
    try {
      // Verify and decode
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return null;
    }
  },

  generateHex(length) {
    return crypto.randomBytes(length / 2).toString('hex');
  },

  isObjectId(string) {
    return /[a-fA-F0-9]{24}/.test(string);
  },

  slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  },

  regexEscape(text) {
    return text.replace(/[-[\]{}()*+!<=:?./\\^$|#\s,]/g, '\\$&');
  },

  stringify(obj) {
    return JSON.stringify(obj, Helper.jsonReplacer);
  },

  // JSON function to use together with JSON.stringify to get rid of circular reference. e.g. JSON.stringify(target, Helper.jsonReplacer);
  jsonReplacer(key, value) {
    let cache = [];
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Circular reference found, discard key
        return;
      }
      // Store value in our collection
      cache.push(value);
    }
    // Enable garbage collection
    cache = null;
    return value;
  },
};

Helper.env = app.get('env');

module.exports = Helper;
