
var express = require('express');
var mongo = require('mongodb').MongoClient

var app = express();

mongo.connect(process.env.URL, function(err, db) {
   var collection = db.collection("websites");
  
  
app.get('/new/:url*', function(req,res){
  
  var url = req.url.slice(5)
  
 
  
var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  
  
  if(!regex.test(url)) {     
          res.send({error: "Wrong url format"});
      }
      else {
        
           collection.find({}).toArray(function(err, documents) {
           if(err){
              res.send({error: err});
           }
           var shortlinkList =[]
           documents.forEach(function(element) {
                  shortlinkList.push(element.short_url);
               });
                 do {       
                      var link = Math.floor(100000 + Math.random() * 10000).toString();
                    } while (shortlinkList.indexOf(link ) != -1);  
           
                   var doc = {"original_url": url, "short_url": link};
                   
                collection.insert(doc, function(err, data) {
                      if(err){
                          res.send({error: err});
                       }
                  else {
                    res.send({"original_url": url, "short_url": link});
                  }
              })
                   
        
                                    
              }); 
      
        

  } 

});
     
     app.get('/', function(req,res){
  res.sendFile(process.cwd() + '/views/index.html');
});
     
     app.use(express.static(process.cwd() + '/public'));
     
     app.get('/:url', function(req,res){
  
         var url = req.params.url
         collection.findOne({short_url: url},function(err, result) {
            if(err){
              res.send({error:'error'});
            }
            else {
              if(result) {
                res.redirect(result.original_url) 
              }
              else {
                  res.send({"error": "This url is not on the database."});
              }
                             
          }
                
                  
         });   
      

});


});




// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;