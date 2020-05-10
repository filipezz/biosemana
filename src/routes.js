import { Router } from 'express';
import authMiddleware from './Middlewares/auth';

import ParticipantController from './app/controllers/ParticipantController';
import MinicursoController from './app/controllers/MinicursoController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.put('/participants/:id', ParticipantController.update);
routes.post('/participants', ParticipantController.store);

routes.use(authMiddleware);
routes.get('/participants', ParticipantController.index);

routes.get('/minicursos', MinicursoController.index);
routes.get('/minicursos/:id', MinicursoController.show);
routes.post('/minicursos', MinicursoController.store);
routes.delete('/minicursos/:id', MinicursoController.delete);
routes.put('/minicursos/:id', MinicursoController.update);

export default routes;
