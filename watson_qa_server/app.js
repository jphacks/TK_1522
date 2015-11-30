/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');


var fs = require('fs');
var watson = require('watson-developer-cloud');
var crypto = require('crypto');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '160.16.53.10',
  user     : 'tk_22',
  password : 'nas1129',
  database : 'jphacks2015_tk22'
});


// create a new express server
var app = express();

// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));


// config of watson dialog
var dialogService = watson.dialog({
  username: "e4cdae82-6f91-483f-b2d5-80eb559d46ec",
  password: "6qauQFqK9w6E",
  version: 'v1'
});

app.get('/dbtest/', function (req,res) {
  //connection.connect(function(err) {
  //  if (err) {
  //    req.send('error connecting: ' + err.stack);
  //    return;
  //  }

  //  req.send('connected as id ' + connection.threadId);
  //});
  connection.query('select * from conversations', function (err, rows) {
  //  res.render('users', { title: 'Express Users', users: rows });
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

app.get('/dialog/new/', function(request, response) {
  setAllowOriginHeader(response);
  var params = {
    name: 'dialog_'+(+new Date()).toString(36),
    file: fs.createReadStream('./template.xml')
  };
  dialogService.createDialog(params, function(err, dialog) {
    if (err) {
      response.send(err)
    } else {
      response.send(dialog);
    }
  });
});

app.get('/conversation/new/:dialog_id/', function(req,res) {
  setAllowOriginHeader(res);
  connection.query('insert into conversations(dialog_id) values("'+req.params.dialog_id+'")', function (err, rows) {
    if (err) {
      res.send(err)
    } else {
      res.send({id:rows.insertId});
    }
  });
});

app.get('/conversation/:id', function(req,res) {
  setAllowOriginHeader(res);
  connection.query('select * from conversations where id='+req.params.id, function (err, rows) {
    if (err) {
      res.send({message: 'error in inserting into mysql', error: err});
    } else if (rows.length > 0) {
      var params = {
        dialog_id: rows[0].dialog_id,
        conversation_id: rows[0].conversation_id,
        client_id: rows[0].client_id,
        input:     req.query.input
      };

      dialogService.conversation(params, function(err, conversation) {
        if (err) {
          res.send({message: 'error in dialogService', error: err, params: params});
        } else {
          var questions = rows[0].questions ? rows[0].questions : '';
          var answers = rows[0].answers ? rows[0].answers : '';

          if (conversation) {
            questions = questions + " " + conversation.response.join(" ");
            answers = answers + " " + conversation.input;
          }

          questions = questions.replace(/'/g,"\\'");
          answers = answers.replace(/'/g,"\\'");
          
          connection.query("update conversations set conversation_id="+conversation.conversation_id+", client_id="+conversation.client_id+", questions='"+questions+"', answers='"+answers+"' where id="+req.params.id, function (err, rows) {
            if (err) {
              res.send({message: 'error in updating mysql', error: err,query:"update conversations set conversation_id="+conversation.conversation_id+", client_id="+conversation.client_id+", questions='"+questions+"', answers='"+answers+"' where id="+req.params.id})
            } else {
              res.send({conv:conversation});
            }
          });
        }
      });
    } else {
      res.send({message: 'no conversation which id is '+req.params.id});
    }
  });
  
});

app.get('/answers/:id', function (req,res) {
  setAllowOriginHeader(res);
  connection.query('select answers from conversations where id='+req.params.id, function (err, rows) {
    if (err) {
      res.send(err);
    } else {
      if (rows.length > 0) {
        res.send(rows[0]);
      } else {
        res.send({message: 'no answers of conversation which id is '+req.params.id});
      }
    }
  });
});

app.get('/dialog/delete/:id', function(req,res) {
  setAllowOriginHeader(res);
  dialogService.deleteDialog({dialog_id: req.params.id}, function(err, dialog) {
    if (err) {
      res.send(err)
    } else {
      res.send(dialog);
    }
  });
});

function setAllowOriginHeader(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
}

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
