import { logger } from '../Logger'

export class Mailer {
  async sendPasswordResest({email, token}: {email: string, token: string}): Promise<void> {
    logger.debug(`would send email to ${email} with token: ${token}`)
  }

  async sendPasswordHasBeenResest({email}: {email: string}): Promise<void> {
    logger.debug(`would send password has been reset email to ${email}`)
  }
}

export const mailer = new Mailer()
