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
      cpf: Yup.string().required(),
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
}

export default new ParticipantController();
