import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan'
import db from './app/models/index.js';
import api from "./app/routes/api.js"
import basic from "./app/routes/basic.js"
import board from "./app/routes/board.js"
import user from "./app/routes/user.js"
import index from "./app/routes/index.js"
import todo from "./app/routes/todo.js"
import ResponseService from "./app/services/responseService.js";

// const tokenRouter = require('./app/routes/token');

async function startServer() {
    dotenv.config()
    const app = express();
    const mongoUri = process.env.MONGO_URI
    const port = process.env.port
    // app.use('/token', tokenRouter);
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use("/", index);
    app.use("/api", api);
    app.use("/basic", basic);
    app.use("/board", board);
    app.use("/user", user);
    app.use("/todo", todo);

    app.use(morgan('dev'))
    // const APP = './app/routes' const nodes = ['basic', 'board', 'user', 'todo']
    // for (const leaf of nodes) {require(`${APP}/${leaf}.route`)({url:`/api/${leaf}`, app}) }
    const responseService = new ResponseService()
    db
        .mongoose
        .connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log(' 몽고DB 연결 성공 ')
        })
        .catch(err => {
            console.log(' 몽고DB 연결 실패', err)
            process.exit();
        });

    app.all("*", function (_req, res) {
        return responseService.notFoundResponse(res, "페이지를 찾을 수 없습니다");
    });

    app.use((err, _req, res) => {
        if(err.name == "UnauthorizedError"){
          return responseService.unauthorizedResponse(res, err.message);
        }
      });

    app.listen(port, () => {
        console.log('***************** ***************** *****************')
        console.log('********** 서버가 정상적으로 실행되고 있습니다 *********')
        console.log('***************** ***************** *****************')
    })
}
startServer();