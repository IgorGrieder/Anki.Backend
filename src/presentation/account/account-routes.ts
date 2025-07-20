import { Router } from 'express'
import { createAccountController } from './account-controller';
import { createAccountSchema } from '../../domain/account/account-schema';
import { genericValidator } from '../middleware/generic-validator';

export const accountRouter = Router();

accountRouter.post('/create-account', genericValidator(createAccountSchema), createAccountController);


