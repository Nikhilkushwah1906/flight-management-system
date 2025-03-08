var express = require('express');
var router = express.Router();
var pool = require('./pool');
var upload = require('./multer')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.post('/flight_submit',upload.single("clogo"),function (req , res , next) {
  var days = req.body.days + ""
  pool.query('insert into flight(flightname, planetype, seats, source_city, destination_city, source_terminal, destination_terminal, days, arrivaltime, departuretime, fare, companyname, companylogo) values(?,?,?,?,?,?,?,?,?,?,?,?,?)',
                        [req.body.flightname,
                          req.body.planetype,
                          req.body.totalseats,
                          req.body.source,
                          req.body.destination,
                          req.body.sourceterminal,
                          req.body.destinationterminal,
                          days,
                          req.body.arrivaltime,
                          req.body.departuretime,
                          req.body.fare,
                          req.body.companyname,
                          req.file.filename],function (error,result)  {
                          if (error) {
                            console.log(error)
                            res.render('flightinterface',{statu:false, Message: 'Database Error: Pls Contact With Database Administrator '});
                          } 
                          else {
                            res.render('flightinterface',{statu:true, Message: 'Flight Submitted Successfully'});
                          }
                        })
})


router.post('/edit_flight_picture',upload.single("clogo"),function (req , res , next) {
  pool.query('update flight set companylogo=? where flightid=?',[req.file.filename,req.body.flightid],function (error,result)  {
                          if (error) {
                            console.log(error)
                            res.redirect('/flight/display_all_flights');
                          } 
                          else {
                            res.redirect('/flight/display_all_flights');
                          }
                        })
})


router.post('/edit_delete_flight',function (req , res , next) {
  if(req.body.btn=='Edit') {
    var days = req.body.days + ""
  pool.query('update flight set flightname=?, planetype=?, seats=?, source_city=?, destination_city=?, source_terminal=?, destination_terminal=?, days=?, arrivaltime=?, departuretime=?, fare=? , companyname=? where  flightid=? ',
                        [req.body.flightname,
                          req.body.planetype,
                          req.body.totalseats,
                          req.body.source,
                          req.body.destination,
                          req.body.sourceterminal,
                          req.body.destinationterminal,
                          days,
                          req.body.arrivaltime,
                          req.body.departuretime,
                          req.body.fare,
                          req.body.companyname,
                          req.body.flightid],function (error,result)  {
                          if (error) {
                            console.log(error)
                            res.redirect('/flight/display_all_flights')
                          } 
                          else {
                            res.redirect('/flight/display_all_flights')
                          }
                        })
                      }

                      else if (req.body.btn == 'Delete')
                      {
                        pool.query('Delete from flight where  flightid=?',[ req.body.flightid],function (error,result)  {
                            if (error) {
                              console.log(error)
                              res.redirect('/flight/display_all_flights')
                            } 
                            else {
                              console.log(error)
                              res.redirect('/flight/display_all_flights')
                            }
                          })
                      }

})

router.get('/display_picture_for_edit',function (req,res ,next) {
  try{
    var data = JSON.parse(localStorage.getItem("ADMIN"))
    if(data==null){
     res.render("adminlogin",{message : ''})
   }
   else {
    res.render('displaypictureforedit',{data : JSON.parse(req.query.flightdata)})
   }
  }
  catch(e) {
   res.render("adminlogin",{message : ''})
  }
})


router.get('/flight_interface',function (req , res , next) {
  try{
       var data = JSON.parse(localStorage.getItem("ADMIN"))
       if(data==null){
        res.render("adminlogin",{message : ''})
      }
      else {
        res.render('flightinterface',{Message:''});
      }
     }
     catch(e) {
      res.render("adminlogin",{message : ''})
     }
  });

router.get('/fetch_all_cities',function (req , res , next) {
    pool.query('select * from city', function(error,result){
      if (error) {
        res.status(500).json({statu:false, Message: 'Database Error: Pls Contact With Database Administrator '});
      } 
      else {
        res.status(200).json({data:result,statu:true, Message: 'Success'});
      }
    });
  });

router.get('/fetch_all_terminals',function (req , res , next) {
    pool.query('select * from terminal where cityid=?',[req.query.cityid], function(error,result){
      if (error) {
        res.status(500).json({statu:false, Message: 'Database Error: Pls Contact With Database Administrator '});
      } 
      else {
        res.status(200).json({data:result,statu:true, Message: 'Success'});
      }
    });
  });

router.get('/display_all_flights',function(req , res , next) {
  try{
    var data = JSON.parse(localStorage.getItem("ADMIN"))
    if(data==null){
     res.render("adminlogin",{message : ''})
   }
   else {
   pool.query('select F.* ,(select C.cityname  from city C where C.cityid = F.source_city) as sourcecity ,(select T.terminalname  from terminal T where T.terminalid = F.source_terminal) as sourceterminal , (select T.terminalname  from terminal T where T.terminalid = F.destination_terminal) as destinationterminal , (select C.cityname  from city C where C.cityid = F.destination_city) as destinationcity from flight F', function (error,result) {
    if(error){
      console.log(error)
      res.render('displayall', {status : false , Message: 'Database Error: Pls Contact With Database Administrator '})
    }
    else {
      res.render('displayall',{data : result , status:false, Message : 'Success'})
    }
  })
}
}
catch(e) {
res.render("adminlogin",{message : ''})
}
})

router.get('/display_for_edit',function(req, res , next) {
  try{
    var data = JSON.parse(localStorage.getItem("ADMIN"))
    if(data==null){
     res.render("adminlogin",{message : ''})
   }
   else {
     
  pool.query('select F.* ,(select C.cityname  from city C where C.cityid = F.source_city) as sourcecity ,(select T.terminalname  from terminal T where T.terminalid = F.source_terminal) as sourceterminal , (select T.terminalname  from terminal T where T.terminalid = F.destination_terminal) as destinationterminal , (select C.cityname  from city C where C.cityid = F.destination_city) as destinationcity from flight F where F.flightid=?' ,[req.query.flightid] , function (error,result) {
    if(error){
      console.log(error)
      res.render('displayforedit', {status : false , Message: 'Database Error: Pls Contact With Database Administrator '})
    }
    else {
      res.render('displayforedit',{data : result[0] , status:false})
    }
   })
    }
  }
  catch(e) {
   res.render("adminlogin",{message : ''})
  }
})

module.exports = router;