import * as Yup from "yup";

import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      const errors = await schema.validate(req.body, { abortEarly: false }).catch(err => err.errors);
      return res.status(400).json({
        error: errors
      });
    }

    const userExists = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exist" });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) => (oldPassword ? field.required() : field)),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password
          ? field
              .required()
              .oneOf([Yup.ref("password")], "The password field does not match with confirm password field")
          : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      const errors = await schema.validate(req.body, { abortEarly: false }).catch(err => err.errors);
      return res.status(400).json({
        error: errors
      });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email
        }
      });

      if (userExists) {
        return res.status(400).json({
          error: "User already exist"
        });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({
        error: "Password does not match"
      });
    }

    const { id, name, provider, email: e } = await user.update(req.body);

    return res.json({ id, name, email: e, provider });
  }
}

export default new UserController();
