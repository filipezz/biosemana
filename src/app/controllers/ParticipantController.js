import * as Yup from 'yup';

import Participant from '../models/Participant';
import Minicurso from '../models/Minicurso';

class ParticipantController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      cpf: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      const errors = await schema
        .validate(req.body, { abortEarly: false })
        .catch(err => {
          return err.errors;
        });

      return res.status(400).json({ errors });
    }

    const { email } = req.body;
    const participantExtists = await Participant.findOne({ where: { email } });

    if (participantExtists) {
      return res.status(400).json({ error: 'Participant already exists' });
    }
    const participant = await Participant.create(req.body);

    return res.json(participant);
  }

  async index(req, res) {
    const participants = await Participant.findAll({
      attributes: ['id', 'name', 'email', 'cpf'],
      include: [
        {
          model: Minicurso,
          as: 'minicurso_noturno',
          attributes: [
            'id',
            'title',
            'description',
            'speaker',
            'size',
            'shift',
          ],
        },
        {
          model: Minicurso,
          as: 'minicurso_diurno',
          attributes: [
            'id',
            'title',
            'description',
            'speaker',
            'size',
            'shift',
          ],
        },
      ],
    });

    return res.json(participants);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      minicurso_diurno_id: Yup.number(),
      minicurso_noturno_id: Yup.number(),
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

    const { minicurso_diurno_id, minicurso_noturno_id } = req.body;

    const minicursoDiurno = await Minicurso.findByPk(minicurso_diurno_id);
    const minicursoNoturno = await Minicurso.findByPk(minicurso_noturno_id);
    const participant = await Participant.findByPk(id);

    if (minicurso_diurno_id && !minicurso_noturno_id) {
      if (!minicursoDiurno) {
        return res
          .status(400)
          .json({ error: 'This minicurso diurno does not exists' });
      }

      const participantCountForThatMinicursoDiurno = await Participant.findAndCountAll(
        {
          where: {
            minicurso_diurno_id,
          },
        }
      );
      if (participantCountForThatMinicursoDiurno.count < minicursoDiurno.size) {
        await participant.update(req.body);
        participant.save();

        return res.json(participant);
      }
      return res.json({ error: 'This minicurso is sold out' });
    }
    if (!minicurso_diurno_id && minicurso_noturno_id) {
      if (!minicursoNoturno) {
        return res
          .status(400)
          .json({ error: 'This minicurso noturno does not exists' });
      }
      const participantCountForThatMinicursoNoturno = await Participant.findAndCountAll(
        {
          where: {
            minicurso_noturno_id,
          },
        }
      );
      if (
        participantCountForThatMinicursoNoturno.count < minicursoNoturno.size
      ) {
        await participant.update(req.body);
        participant.save();
        return res.json(participant);
      }
      return res
        .status(400)
        .json({ error: 'This minicurso noturno is sold out' });
    }
    if (!minicursoDiurno) {
      return res
        .status(400)
        .json({ error: 'This minicurso diurno does not exists' });
    }
    if (!minicursoNoturno) {
      return res
        .status(400)
        .json({ error: 'This minicurso noturno does not exists' });
    }
    const participantCountForThatMinicursoNoturno = await Participant.findAndCountAll(
      {
        where: {
          minicurso_noturno_id,
        },
      }
    );
    const participantCountForThatMinicursoDiurno = await Participant.findAndCountAll(
      {
        where: {
          minicurso_diurno_id,
        },
      }
    );
    if (
      participantCountForThatMinicursoDiurno.count < minicursoDiurno.size &&
      !(participantCountForThatMinicursoNoturno.count < minicursoNoturno.size)
    ) {
      await participant.update({
        minicurso_diurno_id,
        minicurso_noturno_id: null,
      });
      participant.save();
      return res.json({
        message: 'Your choice for minicurso noturno is sold out',
        participant,
      });
    }
    if (
      !(participantCountForThatMinicursoDiurno.count < minicursoDiurno.size) &&
      participantCountForThatMinicursoNoturno.count < minicursoNoturno.size
    ) {
      await participant.update({
        minicurso_diurno_id: null,
        minicurso_noturno_id,
      });
      participant.save();
      return res.json({
        message: 'Your choice for minicurso diurno is sold out',
        participant,
      });
    }
    if (
      !(participantCountForThatMinicursoDiurno.count < minicursoDiurno.size) &&
      !(participantCountForThatMinicursoNoturno.count < minicursoNoturno.size)
    ) {
      return res.status(400).json({ error: 'Both minicursos are sold out' });
    }
    await participant.update({
      minicurso_diurno_id,
      minicurso_noturno_id,
    });
    participant.save();
    return res.json(participant);
  }
}

export default new ParticipantController();
