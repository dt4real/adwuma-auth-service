import { changePassword, forgotPassword, resetPassword } from '@auth/controllers/password.controller';
import { read } from '@auth/controllers/signin.controller';
import { create } from '@auth/controllers/signup.controller';
import { update } from '@auth/controllers/verify-email.controller';
import { updateOTP } from '@auth/controllers/verify-opt.controller';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', read);
  router.put('/verify-email', update);
  router.put('/verify-otp/:otp', updateOTP);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
}