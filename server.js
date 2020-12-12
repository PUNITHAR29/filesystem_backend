import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import _ from 'lodash';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors());

const port = process.env.port || '5000';

app.get('/', (req, res) => {

    fs.readFile('db.json', (err, data) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (data) {
            res.write(data);
        }
        else {
            fs.appendFile('db.json', '{}', (err) => {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                if (!err)
                    res.write('File created');
                else
                    res.write(` ${err}`);
                return res.end();
            });
        }
        return res.end();
    })

});
app.put('/', (req, res) => {

    var empid = req.params.empid;
    var returnData = '{}';
    fs.readFile('db.json', (err, data) => {
        if (data)
            returnData = JSON.parse(data);
    })

    const updateData = JSON.parse(JSON.stringify(req.body));

    setTimeout(() => {

        const finalData = _.map(returnData, (data) => {
            console.log(data);
            if (updateData.empid === data.empid) {
                data.phnum = updateData.phnum;
                data.firstname = updateData.firstname;
                data.lastname = updateData.lastname;
                data.address = updateData.address;
                data.age = updateData.age;
            }
            return data;
        });

        fs.writeFile('db.json', JSON.stringify(finalData), (err) => {
            if (!err)
                res.write('Data updated');
            else
                res.write(` ${err}`);
            return res.end();
        });

    }, 1000);

});

app.post('/', (req, res) => {

    var returnData = '{}';
    fs.readFile('db.json', (err, data) => {
        if (data)
            returnData = JSON.parse(data);
    })

    setTimeout(() => {

        const receivedData = JSON.parse(JSON.stringify(req.body));

        const finalData = _.concat(returnData,receivedData);

        fs.writeFile('db.json', JSON.stringify(finalData), (err) => {
            if (!err)
                res.write('Data inserted');
            else
                res.write(` ${err}`);
            return res.end();
        });

    }, 1000);

});

app.delete('/:empid', (req, res) => {

    var empid = req.params.empid;
    var returnData = '{}';
    fs.readFile('db.json', (err, data) => {
        if (data)
            returnData = JSON.parse(data);
    })

    setTimeout(() => {

        const finalData = _.remove(returnData, (data) => {
            return empid === data.empid;
        });

        fs.writeFile('db.json', JSON.stringify(returnData), (err) => {
            if (!err)
                res.write('Data deleted');
            else
                res.write(` ${err}`);
            return res.end();
        });

    }, 1000);

});

app.listen(port, (err) => {
    if (!err)
        console.log(`listening to the port ${port}`);
    else
        console.log(`trouble starting the server ${err}`);
});

