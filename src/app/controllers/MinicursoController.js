import * as Yup from 'yup';
import Minicurso from '../models/Minicurso';

class MinicursoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      speaker: Yup.string().required(),
      size: Yup.number().required(),
      shift: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      const errors = await schema
        .validate(req.body, { abortEarly: false })
        .catch(err => {
          return err.errors;
        });

      return res.status(400).json({ errors });
    }
    const { title } = req.body;

    const minicursoExists = await Minicurso.findOne({
      where: {
        title,
      },
    });
    if (minicursoExists) {
      return res.status(400).json({ error: 'Minicurso already exists' });
    }
    const minicurso = await Minicurso.create(req.body);

    return res.json(minicurso);
  }

  async index(req, res) {
    const minicursos = await Minicurso.findAll();

    if (!minicursos.length) {
      return res.status(400).json({ error: 'No minicursos registered' });
    }
    return res.json(minicursos);
  }
}

export default new MinicursoController();
