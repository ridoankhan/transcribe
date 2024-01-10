const express = require('express')
const {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} = require('@aws-sdk/client-transcribe-streaming')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/stream', async (req, res) => {
  try {
    const audioChunk = req.body.audioChunk

    // Manually set AWS credentials
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }

    // Create an instance of the TranscribeStreamingClient with manually set credentials
    const client = new TranscribeStreamingClient({
      region: process.env.AWS_REGION,
      credentials,
    })

    // Set up the input parameters for StartStreamTranscriptionCommand
    const params = {
      AudioStream: { AudioEvent: { AudioChunk: audioChunk } },
      MediaEncoding: 'pcm', // Adjust according to your audio format
      MediaSampleRateHertz: 16000, // Adjust according to your audio sample rate
      LanguageCode: 'en-US', // Adjust according to your language
    }

    // Create a new StartStreamTranscriptionCommand
    const command = new StartStreamTranscriptionCommand(params)

    // Send the command to the Transcribe service
    const response = await client.send(command)

    // Handle the response (you can do further processing here)
    console.log('Transcription Result:', response)

    // Send a response back to the React application if needed
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
