import * as Yup from 'yup';

import Minicurso from '../models/Minicurso';
import Participant from '../models/Participant';

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
    const { description, speaker, size, shift } = req.body;

    const minicurso = await Minicurso.create({
      title,
      description,
      speaker,
      size,
      shift: shift.toUpperCase(),
    });

    return res.json(minicurso);
  }

  async index(req, res) {
    const minicursos = await Minicurso.findAll();

    if (!minicursos.length) {
      return res.status(400).json({ error: 'No minicursos registered' });
    }
    return res.json(minicursos);
  }

  async delete(req, res) {
    const { id } = req.params;

    const minicurso = await Minicurso.findByPk(id);
    if (!minicurso) {
      return res.status(400).json({ error: 'This minicurso does not exists' });
    }
    await minicurso.destroy();

    return res.json();
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      speaker: Yup.string(),
      size: Yup.number(),
      shift: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      const errors = await schema
        .validate(req.body, { abortEarly: false })
        .catch(err => {
          return err.errors;
        });

      return res.status(400).json({ errors });
    }
    const { id } = req.params;

    const minicurso = await Minicurso.findByPk(id);
    if (!minicurso) {
      return res.status(400).json({ error: 'Minicurso does not exists' });
    }
    await minicurso.update(req.body);
    await minicurso.save();
    return res.json(minicurso);
  }

  async show(req, res) {
    const { id } = req.params;

    let minicurso = await Minicurso.findOne({
      where: {
        id,
      },
    });
    const { title, description, speaker, size } = minicurso;

    if (minicurso.shift === 'NOTURNO') {
      const participantsOfThatMinicurso = await Participant.findAll({
        where: {
          minicurso_noturno_id: id,
        },
        attributes: ['id', 'name', 'email', 'cpf'],
      });
      minicurso = {
        title,
        description,
        speaker,
        size,
        participants: participantsOfThatMinicurso,
      };
      return res.json(minicurso);
    }
    const participantsOfThatMinicurso = await Participant.findAll({
      where: {
        minicurso_diurno_id: id,
      },
      attributes: ['id', 'name', 'email', 'cpf'],
    });
    minicurso = {
      title,
      description,
      speaker,
      size,
      participants: participantsOfThatMinicurso,
    };
    return res.json(minicurso);
  }
}

export default new MinicursoController();
