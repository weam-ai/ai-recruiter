# HeyGen Interactive Avatar Integration

This document describes the HeyGen Interactive Avatar integration for the interview application.

## Overview

The HeyGen integration provides an AI-powered avatar that can conduct interviews using a professional male avatar. This integration offers both voice and text-based interview modes, providing a more engaging and interactive interview experience.

## Features

- **Professional AI Avatar**: Uses Dexter Doctor (professional male avatar) for interviews
- **Multiple Interview Modes**: Voice-only, text-only, or mixed mode
- **Real-time Interaction**: Live avatar responses and user interaction
- **Interview Management**: Start, pause, resume, and end interview sessions
- **Message History**: Complete conversation history with timestamps
- **Seamless Integration**: Works alongside existing Retell integration

## Setup

### 1. Install Dependencies

The required dependencies are already added to `package.json`:

```json
{
  "@heygen/streaming-avatar": "^2.0.13",
  "ahooks": "^3.8.4"
}
```

Run the following command to install:

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# HeyGen Configuration
HEYGEN_API_KEY=your-heygen-api-key
NEXT_PUBLIC_HEYGEN_BASE_API_URL=https://api.heygen.com
```

### 3. Get HeyGen API Key

1. Sign up for a HeyGen account at [https://heygen.com](https://heygen.com)
2. Navigate to your API settings
3. Generate an API key
4. Add the API key to your environment variables

## Usage

### Interview Mode Selection

When starting an interview, users can choose between:

1. **Traditional Voice**: Uses the existing Retell integration
2. **AI Avatar**: Uses the new HeyGen avatar integration

### Avatar Modes

When using the AI Avatar mode, users can select:

- **Voice**: Voice-only interaction with the avatar
- **Text**: Text-based chat with the avatar
- **Mixed**: Both voice and text interaction options

### Interview Flow

1. **Pre-Interview**: User selects interview mode and avatar preferences
2. **Interview Start**: Avatar initializes and greets the candidate
3. **During Interview**: Real-time interaction with the AI avatar
4. **Interview End**: Avatar provides closing statement and session ends

## Components

### Core Components

- `InterviewAvatar`: Main avatar component
- `InterviewAvatarVideo`: Video display component
- `InterviewAvatarControls`: Control interface
- `InterviewMessageHistory`: Conversation history

### Hooks

- `useStreamingAvatarSession`: Manages avatar session state
- `useVoiceChat`: Handles voice interaction
- `StreamingAvatarProvider`: Context provider for avatar functionality

## Configuration

### Avatar Settings

The avatar is configured in `src/lib/heygen-constants.ts`:

```typescript
export const INTERVIEW_AVATAR_CONFIG: StartAvatarRequest = {
  avatarName: "Dexter_Doctor_Standing2_public",
  quality: AvatarQuality.High,
  voice: {
    rate: 1.0,
    emotion: VoiceEmotion.NEUTRAL,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};
```

### Available Avatars

The system includes several professional avatars suitable for interviews:

- Dexter Doctor (Professional) - Default
- Ann Therapist
- Shawn Therapist
- Bryan Coach
- Elenora Tech Expert

## API Endpoints

### HeyGen Access Token

- **Endpoint**: `/api/heygen/get-access-token`
- **Method**: POST
- **Description**: Retrieves HeyGen access token for avatar sessions

## Error Handling

The integration includes comprehensive error handling for:

- API connection issues
- Microphone permission problems
- Avatar initialization failures
- Network connectivity issues

## Browser Compatibility

The HeyGen integration requires:

- Modern browsers with WebRTC support
- Microphone access for voice mode
- Stable internet connection
- HTTPS (required for microphone access)

## Troubleshooting

### Common Issues

1. **Avatar not loading**: Check HeyGen API key and network connection
2. **Microphone not working**: Ensure browser permissions are granted
3. **Audio quality issues**: Check internet connection and browser audio settings

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and session information.

## Future Enhancements

- Custom avatar selection per interview
- Multi-language support
- Advanced interview analytics
- Integration with existing interview question management
- Custom avatar behavior configuration

## Support

For technical support or questions about the HeyGen integration, please refer to:

- HeyGen Documentation: [https://docs.heygen.com](https://docs.heygen.com)
- Project Documentation: See main README.md
- Issue Tracker: GitHub Issues
