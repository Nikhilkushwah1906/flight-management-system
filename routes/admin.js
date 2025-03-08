var express = require('express');
var router = express.Router();
var pool = require('./pool');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/logout',function(req,res,next){
    localStorage.clear()
    res.render("adminlogin", { message : " "})
})

router.get('/adminlogin',function(req,res,next){
       res.render("adminlogin",{message : ''})
})

router.get('/dashboard',function (req,res,next) {
    try{
        var data = JSON.parse(localStorage.getItem("ADMIN"))
        if(data==null){
         res.render("adminlogin",{message : ''})
       }
       else {
     res.render('dashboard',{data :data})
}
}
catch(e) {
 res.render("adminlogin",{message : ''})
}
})

router.post('/check_admin_login',function (req,res,next) {
   
    pool.query('select * from admins where ( emailid=? or mobileno=? ) and password=? ',[ req.body.emailid, req.body.emailid , req.body.password ] , function(error,result) {
        if(error){
           
            res.status(500).render('adminlogin',{ status : false , message : 'Database Error.. Pls Contact System ADMIN'})
        }
        else {
            if(result.length==1){
                localStorage.setItem('ADMIN',JSON.stringify(result[0]))
                res.status(200).render('dashboard',{ status : true , message : 'Success', data: result[0]})
            }
            else {
                console.log('xxx'+result)
                res.status(200).render('adminlogin' , { status : false , message : 'Invalid Emialid Password'})
            }
        }
    })
})

module.exports = router;