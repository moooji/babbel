const babbel = require('./index');

const translator = babbel.create({ apiKey: 'trnsl.1.1.20150713T101248Z.e2522f2553a1591a.b08c665b176fb26527ae0579ce92e9c3e6e7f523' });

translator.translate('Deux', 'en')
  .then(res => console.log(res))
  .catch(err => {
    if (err instanceof translator.RequestError) {
      console.log('RequestError');
    } else {
      console.error(err);
    }
  });
