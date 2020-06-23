const app = require('./app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`\n🚀 ... Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});
