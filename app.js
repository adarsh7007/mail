const express = require('express')
const app = express();

const cron = require('node-cron');
const smtpPool = require('nodemailer-smtp-pool')
const nodeMailer = require('nodemailer'),
bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.render('index');
});

app.post('/send-email', (req, res) => {
   var transporter = nodeMailer.createTransport(smtpPool({
      service:'Gmail',
   //  port: 587,
   //  secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.GMAIL_EMAIL, // generated ethereal user
      pass: process.env.GMAIL_PASS // generated ethereal password
    }
   }));

   let mailOptions = {
      from: 'adarsrastogi7007@gmail.com',
      to: req.body.to, // receiver Email
      subject: req.body.subject, // Subject line
     // mail: req.body.mail, // plain text body
      html: req.body.mail, //'<b>Nodemailer is Working</b>' // html body
   };
   cron.schedule('* * * * *', () => {
   transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log("Message send Successfully");
      res.render('index');
   });
 });
});
app.listen(port, () => {
   console.log('Server is listening on PORT: ' + port);
});
