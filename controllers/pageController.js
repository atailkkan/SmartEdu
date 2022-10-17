const nodemailer = require("nodemailer");

exports.getMainPage = (req, res) => {
    console.log(req.session.userID);
    res.status(200).render('index', { pageName: 'index' });
};

exports.getAboutPage = (req, res) => {
    res.status(200).render('about', { pageName: 'about' });
};

exports.getRegisterPage = (req, res) => {
    res.status(200).render('register', { pageName: 'register' });
};

exports.getLoginPage = (req, res) => {
    res.status(200).render('login', { pageName: 'login' });
};

exports.getContactPage = (req, res) => {
    res.status(200).render('contact', { pageName: 'contact' });
};

exports.sendMail = async (req, res) => {

    try
    {
        const outputMail = `
        
            <h1>Mail Details</h1>
            <ul>
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.email}</li>
            </ul>
            <h1>Message</h1>
            <p>${req.body.message}</p>
        `;

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
            user: "atailkkan@gmail.com",
            pass: "fejyizboawydncoh"
            }
        });

        let info = await transporter.sendMail({
            from: '"Smart EDU Contact Form 👻" <atailkkan@gmail.com>',
            to: "atailkkan@gmail.com",
            subject: "Smart EDU Contact Form (New Mail) ✔",
            html: outputMail
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        req.flash('success', 'Your message sent successfully! Thanks.');
        res.status(200).redirect('/contact');
    }
    catch(err)
    {
        req.flash('error', `Ooops! Something went wrong! Error: ${err}`);
        res.status(200).redirect('/contact');
    }
};