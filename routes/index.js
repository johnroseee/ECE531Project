var express = require("express");
var router = express.Router();
var mysql = require("mysql");

const pool = mysql.createPool({
    //connectionLimit : 100,
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
});

/*
router.get("/delete/:id", (req, res, next) => {
  var conn = mysql.createConnection({
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
  });

  var id = req.params.id;
  id = parseInt(id);

  if (isNaN(id)) res.send("\r\nThe entered id value must be an integer.\r\n");
  else {
    conn.connect((err) => {
      if (err) throw err;
      sql = "DELETE FROM action WHERE id ='" + id + "'";
      var rows;
      conn.query(sql, (err, result) => {
        if (err) res.send("\r\n There is no record with that ID value.\r\n");
        res.send("\r\n Record " + id + " has been deleted.\r\n");
      });
    });
  }
});



router.get("/delete", (req, res, next) => {
  var conn = mysql.createConnection({
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
  });

  conn.connect((err) => {
    if (err) throw err;
    sql = "DELETE FROM action";
    var rows;
    conn.query(sql, (err, result) => {
      if (err) throw err;
      res.send("\r\n All records have been deleted.\r\n");
    });
  });
});
*/



router.get("/:id", function (req, res, next) {
  /*var conn = mysql.createConnection({
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
  });
  */
  var id = req.params.id;
  id = parseInt(id);
  console.log(id);

  if (isNaN(id)) res.send("\r\nThe entered id value must be an integer.\r\n");
  else {
      pool.getConnection((err, conn) => {
      if (err) throw err;
      sql = "SELECT * FROM setpoints WHERE id = '" + id + "'";
      var rows;
      conn.query(sql, (err, result) => {
        if (err) throw err;

        if (result != "") {
          rows = JSON.parse(JSON.stringify(result[result.length - 1]));
	  res.send(id + " " + rows["set_time"] + " " + rows["set_temp"] + "\0"
	);
	}
	else res.send("empty database\r\n");
	conn.release();
	});
    });
   }
});









          /* postheader = rows['header'];
      postBody = rows['footer'];*/ 
//          res.send(
//            "\r\n" + id + ": " + rows["header"] + " " + rows["footer"] + "\r\n"
//          );
//        } else res.send("\r\n Currently no data available.\r\n");
//      });
//    });
//  }
//});



/*
router.get("/", function (req, res, next) {
  var conn = mysql.createConnection({
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
  });
  conn.connect((err) => {
    if (err) throw err;
    sql = "SELECT * FROM action";
    var rows;
    conn.query(sql, (err, result) => {
      if (err) throw err;

      if (result != "") {
        rows = JSON.parse(JSON.stringify(result[result.length - 1]));

        res.send(
          "\r\nThe most recent entry within the database is:\r\n" +
            rows["id"] +
            ": " +
            rows["header"] +
            " " +
            rows["footer"] +
            "\r\n"
        );
      } else res.send("\r\nThere are no records in the database \r\n");
    });
  });
});
*/
/*
router.post("/", (req, res, next) => {
  var conn = mysql.createConnection({
    host: "johnrose.cn3tudykh4cz.us-east-2.rds.amazonaws.com",
    user: "JohnRose",
    password: "JohnRose",
    database: "iotproject",
  });

  conn.connect((err) => {
    if (err) throw err + "\r\n oh nooo";
    var sql =
      'INSERT INTO action(header, footer) VALUES("' +
      req.body.header +
      '","' +
      req.body.footer +
      '")';
    conn.query(sql, (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");
    });

    sql =
      "SELECT * FROM action WHERE header = '" +
      req.body.header +
      "' AND footer = '" +
      req.body.footer +
      "'";
    var rows;
    conn.query(sql, (err, result) => {
      if (err) throw err;

      rows = JSON.parse(JSON.stringify(result[result.length - 1]));

      res.send("\r\n Sweet! The record has been inserted for id: " + rows["id"] + "\r\n");
    });
  });
});
*/

router.post("/state", (req, res, next) => {
    pool.getConnection((err, conn) => {
    if (err) throw err + "failed!!";
    var sql = 'INSERT INTO current_state (status, time, current_temp, set_temp) VALUES ("' +
    req.body.status + '","' +
    req.body.time + '", ' +
    req.body.current_temp + ',' +
    req.body.set_temp + ')';
    conn.query(sql, (err, result) =>{
        if (err) throw err;
        console.log ("One record has been inserted.")
    });
    
    sql = 
        "SELECT * FROM current_state WHERE status = '" + req.body.status +
        "' AND time = '" + req.body.time +
        "' AND current_temp = '" + req.body.current_temp +
        "' AND set_temp = " + req.body.set_temp;
    var rows;
    conn.query(sql, (err, result) => {
    if (err) throw err;
    rows = JSON.parse(JSON.stringify(result[result.length - 1]));
    res.send("worked!!\n");
    conn.release();    
    });
    });
    });

router.post("/", (req,res,next) => {
var temp = req.body.str
pool.getConnection((err,conn) => {
    if (err) throw err;
    var sql = "Select * from current_state";
    conn.query(sql, (err,result) => {
    if (err) throw err;
    var rows = JSON.parse(JSON.stringify(result));
    //var status = rows[0]["status"];
    //var time = rows[0]["time"]
    var current_temp = rows[0]["current_temp"]
    var set_temp = rows[0]["set_temp"]
    current_temp = parseFloat(current_temp)
    set_temp = parseFloat(set_temp)

    //var todays_date = new Date();
    //todays_date.setHours(todays_date.getHours() - 6);
	    if (temp < current_temp) 
	    {
		    var current_status = "ON"
	    }
	    if (temp > set_temp) 
	    {
		    var current_status = "OFF"
	    }
	    current_status = JSON.stringify(current_status)
	    res.send(current_status)
})
})
})

module.exports = router;
