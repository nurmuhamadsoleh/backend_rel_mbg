const SQL_INJECTION_PATTERNS = [
  /(?:--|#|\/\*|\*\/)/,
  /;\s*(?:select|insert|update|delete|drop|alter|truncate|create|replace|grant|revoke)\b/i,
  /\b(?:or|and)\b\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/i,
  /\bunion\b\s+(?:all\s+)?select\b/i,
  /\b(?:select|insert|update|delete|drop|alter|truncate|exec|execute)\b\s+[\w*(]/i
];

const DANGEROUS_OBJECT_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function hasSqlInjectionPattern(value) {
  if (typeof value !== 'string') {
    return false;
  }

  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

function hasDangerousObjectKey(value) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((item) => hasDangerousObjectKey(item));
  }

  return Object.keys(value).some((key) => DANGEROUS_OBJECT_KEYS.has(key) || hasDangerousObjectKey(value[key]));
}

module.exports = {
  hasDangerousObjectKey,
  hasSqlInjectionPattern
};
