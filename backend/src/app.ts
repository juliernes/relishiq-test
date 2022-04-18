import { StatusCodes } from 'http-status-codes';

import axios from 'axios';
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.route('/externalapi/photos/:id?').get(async (req, res) => {
    let jphUrl = `https://jsonplaceholder.typicode.com/albums?_embed=photos&_expand=user`;
    try {

        /*Obtener fotos*/
        let jphResponse = await axios.get(jphUrl);
        console.log(`statusCode: ${jphResponse.status}`);
        if (jphResponse.status != StatusCodes.OK) throw `error al obtener albumes, status: ${jphResponse.status}, message: ${jphResponse.statusText}`;
        let albums: Array<any> = jphResponse.data;

        /*parsear respuesta */
        let photos: Array<any> = [];
        for (let album of albums) {
            delete album.userId;
            for (let photo of album.photos) {
                photo.album = album;
                delete photo.albumId;
                photos.push(photo);
            }
            delete album.photos;
        }

        /*Filtrar fotos*/
        if (req.params.id) {
            req.query.id = req.params.id;
        }

        for (let key in req.query) {
            let value = Array.isArray(req.query[key]) && req.query[key][0] || req.query[key];
            if (key != 'limit' && key != 'offset' && value) {
                if (key == 'album.user.email') {
                    photos = photos.filter(p => p.album.user.email == String(value));
                } else {
                    photos = photos.filter(p => {
                        if (typeof getProp(p, key) === 'string') {
                            return getProp(p, key).includes(String(value));
                        } else {
                            return getProp(p, key) == value;
                        }
                    });
                }
            }
        }

        /*Pagination*/
        let offset: number = req.query.offset ? Array.isArray(req.query.offset) && Number(req.query.offset[0]) || Number(req.query.offset) : 1;
        let limit: number = req.query.limit ? Array.isArray(req.query.limit) && Number(req.query.limit[0]) || Number(req.query.limit) : 25;

        let result = {
            total: photos.length,
            data: photos.slice((offset - 1) * limit, offset * limit)
        };

        res.send(result);

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

function getProp(obj: object, prop: string): any {
    prop = prop.replace(/\[["'`](.*)["'`]\]/g, ".$1")
    return prop.split('.').reduce((prev, curr) => prev ? prev[curr] : undefined, obj || self)
}

app.listen(port, () => {
    console.log(`server is listening on ${port}`);
});