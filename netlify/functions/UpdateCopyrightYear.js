import fetch from 'node-fetch'
import { schedule } from '@netlify/functions'

const BUILD_HOOK = ''

const handler = schedule('0 9 2 1 *', async () => {
    await fetch (BUILD_HOOK, {
      method: 'POST'
    }).then(response => {
      console.log('Build hook response:', response)
    })
  
    return {
      statusCode: 200
    }
  })
  
  export { handler }