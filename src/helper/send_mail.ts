import { systemConfig } from './../config/system.config';
const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');

export const SEND_EMAIL = async (
    mail_to: string, 
    subject: string, 
    templete: string, 
    content: any
  ) => {
  const mail_from = systemConfig.sendgrid.mail_from;
  const api = systemConfig.sendgrid.api_key;
  sgMail.setApiKey(api);
  content = {
    projectName: systemConfig.project_name,
    frontendBaseUrl: systemConfig.application.frontend_base_url,
    ...content,
  }
  content.body = await ejs.renderFile("src/templete/email/" + templete, content, {});
  let html = await ejs.renderFile("src/templete/email/base.ejs", content, {});
  const msg = {
    to: `${systemConfig.project_name} <${mail_to}>`,
    from: mail_from,
    subject: subject,
    text: systemConfig.project_name,
    html: html,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email Sent');
    })
    .catch((error) => {
      console.log(error.message);
      console.log('Email Not Sent');
    });
};
