import { Application } from 'express';
import { healthRoutes } from '@auth/routes/health.route';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
};