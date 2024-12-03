import {
  createKlassSession,
  deleteKlassSession,
  updateKlassSession,
} from '@/controllers';
import { env } from '@/providers';
import express from 'express';
import type { Router } from 'express';
import asyncHandler from 'express-async-handler';

let router: Router;

function setupRouter() {
  router = express.Router();

  router.get('/api/health', (req, res) => {
    res.json({ status: 'OK', environment: env.NODE_ENV });
  });

  router.post(
    '/api/week_schedule/:token/klass_session',
    asyncHandler(createKlassSession),
  );

  router.delete(
    '/api/week_schedule/:token/klass_session',
    asyncHandler(deleteKlassSession),
  );

  router.patch(
    '/api/week_schedule/:token/klass_session',
    asyncHandler(updateKlassSession),
  );
}

export { router, setupRouter };
