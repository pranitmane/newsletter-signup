const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
//we are using the static method of express to serve static files   
//like css, js, images, etc. from the public folder
//app.use(express.static('public')) is a middleware that serves static files
//from the public folder. Now, you can load the files that are in the public folder:

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});


app.post('/', (req, res) => {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName, lastName, email);
    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            } 
        }] 
    }; 

    const jsonData = JSON.stringify(data);

    const url = 'https://us17.api.mailchimp.com/3.0/lists/cd19c1969f';
    const options = {
        method: 'POST',
        auth: 'pranit:API_KEY',
    };

    const request = https.request(url, options, function(response) {
        response.statusCode === 200 ? res.sendFile(__dirname + '/success.html') : res.sendFile(__dirname + '/failure.html');
        response.on('data', function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});  

app.post('/failure', (req, res) => {
    res.redirect('/');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

