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
