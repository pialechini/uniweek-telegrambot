import type { Dict, Env } from '@/types';
import dotenv from 'dotenv';

function findMissingEnvs(names: readonly string[]) {
  const missingEnvs = [] as string[];

  for (const name of names) {
    if (!process.env[name]) {
      missingEnvs.push(name);
    }
  }

  if (missingEnvs.length != 0) {
    throw new Error('Missing env(s): ' + missingEnvs.join(', '));
  }
}

function setupEnv() {
  // Load .env file if exists
  dotenv.config();

  // Check general required envs to be exist
  findMissingEnvs(REQUIRED_ENVS.general);

  // Check environment dependant envs according to
  // NODE_ENV wether is 'development' or 'production'
  if (process.env.NODE_ENV === 'development') {
    findMissingEnvs(REQUIRED_ENVS.development);
  } else {
    findMissingEnvs(REQUIRED_ENVS.production);
  }

  env = process.env as Env;

  // Try to cast env variables to their correct type
  for (const [envVarName, castTo] of Object.entries(CASTING_RULES)) {
    if (!Object.hasOwn(env, envVarName)) {
      continue;
    }

    switch (castTo) {
      case 'number':
        env[envVarName] = Number(env[envVarName]);
        break;
      case 'bool':
        env[envVarName] = Boolean(env[envVarName]);
        break;
    }
  }
}

const CASTING_RULES: Dict<'number' | 'bool'> = {
  PORT: 'number',
} as const;

const REQUIRED_ENVS = {
  general: [
    'TELEGRAM_TOKEN',
    'NODE_ENV',
    'SUPABASE_KEY',
    'SUPABASE_URL',
    'PORT',
    'MINIAPP_URL',
  ],
  development: [],
  production: ['WEBHOOK_SECRET', 'DOMAIN'],
} as const;

let env = {} as Env;

export { setupEnv, env };
