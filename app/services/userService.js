import db from '../models/index.js';
import Repository from '../config/dbConfig.js';
import dotenv from 'dotenv'

export default function UserService() {
    const User = db.User
    // const dbo = new Repository()
    // const dbConnect = dbo.getDb()
    dotenv.config()
    return {
        join(req, res) {
            new User(req.body).save(function (err) {
                if (err) {
                    res
                        .status(500)
                        .send({message: err});
                    console.log('회원가입 실패')
                    return;
                } else {
                    res
                        .status(200)
                        .json({ok: 'ok'})

                }
                console.log('회원가입 성공')
            })
        },
        /**
        getUser(_req, res){
            User.find()
            .exec((err, users) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, users })
            })
        },
        profile(req, res){
            console.log(`### user profile access ### `)
            User.find({userid: req.params.id})
            .exec((err, user) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, user })
            })
        },*/
        login(req, res) {
            User
            .findOne({userid: req.body.userid}, function(err, user){
                if(err) throw err
                if(!user){
                    res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
                }else{
                    console.log(' ### 로그인 정보 : '+ JSON.stringify(user))
                    user.comparePassword(req.body.password, function(_err, isMatch){
                        console.log(' ### JWT 발급 전 : ')
                        if(!isMatch){
                            console.log(' ### 비밀번호가 틀렸습니다. ')
                            res.status(401).send({loginSuccess: false, msg: '비밀번호가 틀렸습니다.'});
                        }else{
                            console.log(' ### JWT 발급 직전 : ')
                            /**const token = jwt.sign(user.toJSON(), 'jwt-secret', {
                                expiresIn: 604800 // 1 week
                            })
                            console.log(' ### JWT 발급 : '+ token)
                            res.json({success: true, token: 'JWT ' + token});*/
                            user.generateToken((err, user)=>{
                                if(err) res.status(400).send(err)
                    
                                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
                                res
                                .status(200)
                                .json(user)
                            })
                        }
                    })
                }
            })
        }
    }

}