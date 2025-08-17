# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application for controlling an Extron Crosspoint Video Matrix Switcher via a Raspberry Pi. The system consists of a React frontend and an Express.js backend that communicates with the Extron hardware through a USB-to-serial connection using picocom.

## Architecture

- **Frontend**: React TypeScript app using Material-UI components with customizable theming
- **Backend**: Express.js server at `/server/index.tsx` that interfaces with Extron hardware via serial communication
- **Configuration**: JSON-based config stored in `server/config.json` for input/output amounts
- **Hardware Interface**: Uses picocom to send commands to `/dev/ttyUSB0` (USB-to-serial adapter)

## Common Commands

### Development
- `npm start` - Start React development server (port 3000)
- `npm run server` - Start Express backend server (port 3001)
- `npm test` - Run React test suite
- `npm run build` - Build React app and compile server TypeScript

### Raspberry Pi Image Creation
- `npm run image` - Build Raspberry Pi image using Packer (requires Docker and ARM builder)

## Key Files

- `src/App.tsx` - Main React component with video matrix control interface
- `server/index.tsx` - Express backend handling serial communication with Extron hardware
- `server/config.json` - Runtime configuration for input/output matrix size
- `packer.json` - Packer configuration for building Raspberry Pi images

## Extron Command Protocol

The app generates Extron SIS commands:
- `INPUT*OUTPUT!` - Route audio+video
- `INPUT*OUTPUT%` - Route video only  
- `INPUT*OUTPUT$` - Route audio only
- `INPUT*,` - Save preset
- `INPUT*.` - Recall preset

## Development Notes

- Backend proxy configured in package.json for local development
- Uses Material-UI theming with color pickers for customization
- Serial communication requires USB-to-serial adapter on `/dev/ttyUSB0`
- PM2 used for process management on Raspberry Pi deployment