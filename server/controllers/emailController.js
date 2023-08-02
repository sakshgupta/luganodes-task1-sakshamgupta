const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

function dailyNotificationEmail(userName, userEmail, currencyDetails) {
  
  const templatePath = path.join(__dirname, 'subscriptionMail.ejs');

  // Read the email template file
  ejs.renderFile(templatePath, { userName, currencyDetails }, (err, html) => {
    if (err) {
      console.error('Error rendering email template:', err);
      return;
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.NODE_MAILER_USER}`,
            pass: `${process.env.NODE_MAILER_PASS}`,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
      from: 'the4musketeeers@gmail.com',
      to: userEmail,
      subject: 'Daily Currency Update - LugaNodes',
      html: html
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent successfully');
      }
    });
  });
}


function limitNotifications(userName, userEmail, upper_bound, lower_bound, current_price, currencyName) {
  
  const templatePath = path.join(__dirname, 'limitMail.ejs');

  // Read the email template file
  ejs.renderFile(templatePath, { upper_bound, lower_bound, current_price, userName }, (err, html) => {
    if (err) {
      console.error('Error rendering email template:', err);
      return;
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: `${process.env.NODE_MAILER_USER}`,
            pass: `${process.env.NODE_MAILER_PASS}`,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let mailOptions = {
      from: 'the4musketeeers@gmail.com',
      to: userEmail,
      subject: `Urgent: ${currencyName} has moved out of limit`,
      html: html
    };

    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        console.log(err);
      } else {
        console.log('Email sent successfully');
      }
    });
  });
}


module.exports = {
    dailyNotificationEmail,
    limitNotifications
};
