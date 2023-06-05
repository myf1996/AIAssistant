import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const generatePasswordHash = async (password, salt) => {
  return bcrypt.hash(password, salt);
};

export const validateUserPassword = async (user, password) => {
  if (user) {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }
  return null;
};

export const randomStringGenerator = (length) => {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
