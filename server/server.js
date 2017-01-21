var conn = DPP.connect('localhost:3000');
Snippets = new Mongo.collection('snippets',conn);//pass the connection

//We need admin/ security login
Tokens = new Mongo.collection('user-tokens');

var token = Tokens.findOne({});

if (!token) {
    initLogin();
} else {
    loginWithToken();
}

//if we have a token, we can continue...

if (token) {
    conn.subscribe('snippets',function() {
     Snippets.find({}).observeChanges({
         added: function(id,s){
             if (!s.text || s.URL) return;
             if (s.text.indexOf('http')==0){
                 s.URL = s.text;
                 try {
                     Snippets.update(_id,id,{set:s});
                 }
                 catch (e) {
                     console.log('ERROR updating ',id)
                     console.log(e);
                 }
             }
         }
     })   
    });
}