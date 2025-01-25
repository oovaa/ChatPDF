import { Router } from 'express'
import { main_chain, no_doc_chain } from '../utils/chains.js'

const messageRouter = Router()
let history = ''

messageRouter.post('/send', async (req, res) => {
  const { question } = req.body
  const { noDoc } = req.body

  let chain

  if (!question)
    return res.status(400).json({ error: 'Missing question parameter' })

  try {
    chain = noDoc ? no_doc_chain : main_chain
    const answer = await chain.invoke({
      question,
      history,
    })

    history += `Human: ${question}\nAI: ${answer}\n`

    res.status(200).json({ answer })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: `An error occurred while processing your request: ${error.message}`,
    })
  }
})

export { messageRouter }
