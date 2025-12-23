import { Router } from 'express'
import { main_chain, no_doc_chain } from '../utils/chains.js'

const messageRouter = Router()

// Store conversation history per session (in production, use Redis or database)
const sessionHistories = new Map()

messageRouter.post('/send', async (req, res) => {
  const startTime = Date.now()
  const { question, noDoc, sessionId = 'default' } = req.body

  // Input validation
  if (!question) {
    return res.status(400).json({ 
      error: 'Missing question parameter',
      message: 'Please provide a question in the request body',
      example: { question: 'What is this document about?' }
    })
  }

  if (typeof question !== 'string' || question.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Invalid question format',
      message: 'Question must be a non-empty string'
    })
  }

  try {
    // Get or initialize session history
    let history = sessionHistories.get(sessionId) || ''
    
    // Choose appropriate chain
    const chain = noDoc ? no_doc_chain : main_chain
    
    // Generate response
    const answer = await chain.invoke({
      question: question.trim(),
      history,
    })

    // Update conversation history
    const updatedHistory = history + `Human: ${question}\nAI: ${answer}\n`
    sessionHistories.set(sessionId, updatedHistory)

    // Calculate response time
    const responseTime = Date.now() - startTime

    // Send enhanced response
    res.status(200).json({ 
      answer,
      metadata: {
        responseTime: `${responseTime}ms`,
        sessionId,
        chainType: noDoc ? 'knowledge_only' : 'document_aware',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in message processing:', error)
    
    // Determine error type and provide helpful message
    let errorMessage = 'An error occurred while processing your request'
    let statusCode = 500
    
    if (error.message.includes('COHERE_API_KEY')) {
      errorMessage = 'API configuration error. Please check your Cohere API key.'
      statusCode = 503
    } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
      errorMessage = 'API rate limit exceeded. Please try again later.'
      statusCode = 429
    } else if (error.message.includes('network') || error.message.includes('timeout')) {
      errorMessage = 'Network error. Please check your connection and try again.'
      statusCode = 503
    }
    
    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString(),
      suggestion: 'If this error persists, please contact support.'
    })
  }
})

// Health check endpoint for the messaging service
messageRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'messaging',
    timestamp: new Date().toISOString(),
    activeSessions: sessionHistories.size
  })
})

export { messageRouter }
