import { Router } from 'express'
import { createAccountController } from './account-controller';

export const accountRouter = Router()

accountRouter.post('/create-account', createAccountController);


