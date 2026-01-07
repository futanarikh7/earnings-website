const express = require("express");
const app = express();
app.use(express.json());

let users = {}; // replace with DB

app.post("/api/tap",(req,res)=>{
  const id = req.body.user_id;

  if(!users[id]){
    users[id] = {
      balance:0,
      energy:100,
      lastTap:Date.now()
    };
  }

  let user = users[id];

  if(user.energy <= 0){
    return res.json({balance:user.balance});
  }

  user.balance += 1;
  user.energy -= 1;

  res.json({balance:user.balance});
});

app.listen(3000);
setInterval(()=>{
  for(const id in users){
    if(users[id].energy < 100){
      users[id].energy += 1;
    }
  }
},60000); // 1 energy per minute

if(Date.now() - user.lastDaily > 86400000){
  user.balance += 500;
  user.lastDaily = Date.now();
}
if(referrer && referrer !== user_id){
  users[referrer].balance += 1000;
}
