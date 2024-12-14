import { WebError } from '@/error';
import { bot, env, router, setupBot, setupEnv, setupRouter } from '@/providers';
import express from 'express';
import type { Express } from 'express';
import { webhookCallback } from 'grammy';

function prepareApp() {
  const app = express();

  app.use(express.json());
  app.use(router);

  // Erorr handling middleware
  // eslint-disable-next-line
  app.use((err: WebError, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
      success: false,
      status: 500,
      error: {
        message: err.message || 'Internal Server Error',
        details: err.details || {},
      },
    });
  });

  // Default 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      status: 404,
      error: {
        message: 'Not Found',
        details: {},
      },
    });
  });

  return app;
}

function runInDevelopmentMode(app: Express) {
  app.listen(env.PORT, () => {
    console.log(`Development server running at http://localhost:${env.PORT}`);
  });

  bot.start();
}

function runInProductionMode(app: Express) {
  app.use('/bot', webhookCallback(bot, 'express'));

  app.listen(env.PORT, async () => {
    console.log(`Production server running at https://${env.DOMAIN}`);
    await bot.api.setWebhook(`https://${env.DOMAIN}/bot`, {
      secret_token: env.WEBHOOK_SECRET,
    });
  });
}

setupEnv();
setupBot();
setupRouter();

const app = prepareApp();

if (env.APP_ENV === 'development') {
  runInDevelopmentMode(app);
} else {
  runInProductionMode(app);
}
