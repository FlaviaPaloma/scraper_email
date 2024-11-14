const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 587;
const EMAIL = 'testescrapeemail@gmail.com';
const PASSWORD = 'brekjtawtenbyosg'; 

async function scrapeData() {
    const url = 'https://www.amazon.com.br/Apple-iPhone-16-Pro-TB/dp/B0DGMC2MR5/ref=sr_1_2_sspa?crid=165RK5R54ICUB&dib=eyJ2IjoiMSJ9.vAvBPSUadIQRG9jVLBcwLukVA5pACQMMrwbOK590gG54jRgQtWfYj4lH7PqgwCh8crdwtnmrrBdP_NkRKcaPhWxMahfOiApXyY5aYMzHrsOsz7LXGxaB_hvZNbQVKjV6nLtwpTihIB3I8lUU7cJpLPIGyJOz6Vc83O4KY2INEl6wQVvspwmR-nCpmgv1aRQb-5vQvjN-pLYrEqDWhq2OfX6M9o1owBrb8enKhzGPTXKUS8BSEiZblImWfbvGTpcEkhpExx4VZPtGDt5XVdBut7XnNYZBhyVKiYbKKr--9jE.s4EaDHDCc9fOt4aGz4AMv8NxSEoQQmC7Jgr9XezjgtI&dib_tag=se&keywords=iphone+16+pro+max&qid=1731609197&sprefix=iphone%2Caps%2C169&sr=8-2-spons&ufe=app_do%3Aamzn1.fos.95de73c3-5dda-43a7-bd1f-63af03b14751&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1';
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $('#productTitle').text().trim();
        const price = $('.a-price-whole').first().text().trim() || 'Preço não encontrado';
        const color = $('#variation_color_name .selection').text().trim() || 'Cor não encontrada';

        return { title, price, color };
    } catch (error) {
        console.error('Erro no scraping:', error);
        throw error;
    }
}

async function sendEmail(title, price, color) {
    const transporter = nodemailer.createTransport({
        host: SMTP_SERVER,
        port: SMTP_PORT,
        secure: false, 
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const mailOptions = {
        from: `"Scraper Bot" <${EMAIL}>`,
        to: 'palomaflavia7@gmail.com',
        subject: 'Detalhes do Produto',
        text: `
        Detalhes do Produto:
        - Título: ${title}
        - Preço: R$ ${price}
        - Cor: ${color}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
    } catch (error) {
        console.error('Erro no envio de email:', error);
        throw error;
    }
}

async function main() {
    try {
        const { title, price, color } = await scrapeData();
        await sendEmail(title, price, color);
    } catch (error) {
        console.error('Erro na execução principal:', error);
    }
}

main();
