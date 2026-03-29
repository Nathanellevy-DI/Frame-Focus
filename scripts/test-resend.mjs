import { Resend } from 'resend';
const resend = new Resend('re_h3CMsiQY_BcCFdZokVJVy6ZvKadL2aAHs');

async function test() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Frame & Focus <onboarding@resend.dev>',
      to: 'Framesfocusprints@mail.ru',
      subject: 'Test Email',
      html: '<p>Testing</p>'
    });
    console.log("Result:", { data, error });
  } catch(e) {
    console.log("Exception:", e)
  }
}
test();
