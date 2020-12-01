#!/bin/bash
cd /home/ubuntu/horacio-bot
NODE_ENV=production npm start > app.out.log 2> app.err.log < /dev/null & 