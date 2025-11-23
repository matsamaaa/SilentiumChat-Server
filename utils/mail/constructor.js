import handlebars from 'express-handlebars';
import path from 'path';

const getConstructor = (category) => {
    const mailConstructor = handlebars.create({
        layoutsDir: path.join(process.env.MAIL_TEMPLATES_DIR),
        partialsDir: path.join(process.env.MAIL_TEMPLATES_DIR, category),
        defaultLayout: 'layout',
        extname: '.hbs',
    });

    return mailConstructor;
}

const constructMail = async (category, subject, variables) => {
    const mailConstructor = getConstructor(category);
    const templatePath = path.join(process.env.MAIL_TEMPLATES_DIR, category, `${subject}.hbs`);

    const html = await mailConstructor.render(templatePath, { 
        ...variables, 
        subject,
        currentYear: new Date().getFullYear(),
    });
    return html;
}

export default constructMail;