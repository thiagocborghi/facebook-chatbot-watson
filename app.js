const port = 3000;

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const watson = require('watson-developer-cloud');

const app = express();
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

const assistant = new watson.AssistantV1({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    url: 'https://gateway.watsonplatform.net/assistant/api',
    version: '2018-02-16'
});

app.get('/', function (req, res) {
    return res.sendFile('./public/index.html');
});

app.post('/dialog', (req, res) => {
    const { message } = req.body;
    assistant.message(
        {
            input: { text: message },
            workspace_id: process.env.WATSON_WORKSPACE_ID
        },
        function (err, response) {
            if (err) {
                console.error(err);
            } else {
                const { output } = response;
                return res.json(output.text);
            }
        }
    );
});

app.listen(port, () => console.log(`Running on port ${port}`));