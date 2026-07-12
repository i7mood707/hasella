const { handleChatRequest } = require('../lib/chatController');

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.status(405).json({error:'method not allowed'});
    return;
  }
  try{
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { question, context, history } = body;
    if(!question || typeof question !== 'string'){
      res.status(400).json({error:'missing question'});
      return;
    }
    const result = await handleChatRequest(question, context, history);
    res.status(200).json(result);
  }catch(err){
    res.status(err.status || 502).json({error: err.message});
  }
};
