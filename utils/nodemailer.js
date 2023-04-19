import nodemailer from "nodemailer"; //para enviar y configurar emails desde la página web

//La función transporter.sendmail(..) puede tardar un tiempo indefinido en ejecutarse. Por lo tanto el nodeMailer tiene que devolver una Promesa.

const nodeMailer = (from, to, subject, html) => {
  return new Promise((resolve, reject) => {

    //Definimos el proveedor de correo que vamos a utilizar 
    const transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "pruebatarrias@outlook.com",
        pass: "tarrias#1998",
      },
    });

    //Definimos los parámetros del mensaje
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html,
    };

    //Enviamos el mail configurado
    transporter.sendMail(mailOptions, (err, info) => {
      return err ? resolve(err) : resolve(true);
    });
  });
};

export default nodeMailer;
