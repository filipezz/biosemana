import { Router } from 'express';
import authMiddleware from './Middlewares/auth';

import ParticipantController from './app/controllers/ParticipantController';
import MinicursoController from './app/controllers/MinicursoController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json({ hello: 'world' });
});
routes.post('/sessions', SessionController.store);

routes.post('/participants', ParticipantController.store);
routes.get('/participants', ParticipantController.index);

routes.use(authMiddleware);

routes.post('/minicursos', MinicursoController.store);
routes.get('/minicursos', MinicursoController.index);

export default routes;
