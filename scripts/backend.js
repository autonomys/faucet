
//import function
const drip = require('./drip'); 


//Check Identity 
// api.js
const { app } = require('express');

//define Express app 
const app = express();

// starting the server
app.listen(3001, () => {
    console.log('listening on port 3001');
  });


// confirm identity and call smart contract endpoint
app.post('/confirm', async (req, res) => {
    const { discordUserId } = req.params;
    
    //check identity



    // if identity check fails, send an error response
    if (!identityCheckResult) {
        return res.status(400).json({ error: 'Identity check failed' });
    }


    await drip(); //call smart contract 

    //success response
    res.json({ success: true });

  });
