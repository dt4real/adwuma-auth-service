import { Application } from 'express';
import { healthRoutes } from '@auth/routes/health.route';
import { authRoutes } from '@auth/routes/auth.route';
import { currentUserRoutes } from '@auth/routes/current-user.route';
import { verifyGatewayRequest } from '@dt4real/adwuma-common';
import { searchRoutes } from '@auth/routes/search.route';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use(BASE_PATH, searchRoutes());
  
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
};