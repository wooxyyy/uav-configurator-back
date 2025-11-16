#!/bin/bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc   | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null   && echo "deb https://ngrok-agent.s3.amazonaws.com bookworm main"   | sudo tee /etc/apt/sources.list.d/ngrok.list   && sudo apt update   && sudo apt install ngrok;
ngrok config add-authtoken 35YLknd0d9sfEat5xVSF0LsfbfN_7bacrFS8qR1zL8RbxMmex;
ngrok http 8000
