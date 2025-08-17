# crosspoint-pi

A portable webapp intended to run on a Rasberry Pi connected to an [Extron Crosspoint Video Matrix Switcher](https://drive.google.com/file/d/1exPTTyh25l4zMl4bGJemgNSFGZxpqFSv/view).

![crosspoint-pi](https://i.imgur.com/jihQqPH.png)

## Installation:

- Download the image here: https://drive.google.com/file/d/1T1nQVMzFYv_hL4Z49WroSLrKsQYMWJz4/view?usp=sharing
- Get a USB to Serial adapter. This is the one I use: https://www.amazon.com/gp/product/B0753HBT12/ref=ppx_yo_dt_b_search_asin_image?ie=UTF8&psc=1
- Burn the image to an SD card that's at least 8GB. Here's a good solution for that: https://www.balena.io/etcher/
- Hook up the PI to the extron with the USB to Serial adapter in the extron's "remote" port.
- Attach the PI to the internet with an ethernet cable. You can also use wifi, but you'll have to configure it on the PI.
- Insert the SD card and power on the PI.
- Wait a few minutes then find the IP address of the PI on your network: https://pimylifeup.com/raspberry-pi-ip-address/
- Navigate in your browser to the IP address on port 3000. For example, mine is currently on 10.0.0.2, so I put http://10.0.0.22:3000 in my address bar.
- It may take a couple minuts for the server to start up, so keep refreshing it.
- Once the app appears, set the amount of inputs and outputs on your extron.
- You can now use crosspoint-pi like you would the front panel buttons of your crosspoint. The main difference is that save/recall preset have been broken up into two buttons and there is no view feature currently.

To enable wifi SSH into the PI with the credentials pi / 1234. Use raspi-config like normal. If you have a PI 1 then getting a USB wifi dongle working will be up to you.

This only represents the bare minimum features intended and many more are planned. These include:

- A kiosk mode that you can upload images to that acts as a nice point and click interface for basic switching/preset switching.
- Volume control, resuliton/framerate control, and other controls that are only available to some models.
- Persistent color customization.
- Better styling and responsiveness.
