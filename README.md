# node-midi-router

## Requirements

### All platform
- Windows, Mac, Linux OS
- node.js
- yarn

### Linux
- alsa
- libudev
- libusb

```sh
# install node.js
sudo apt remove nodejs
sudo apt autoremove
cd /usr/src
sudo wget https://nodejs.org/dist/v11.15.0/node-v11.15.0-linux-armv6l.tar.xz
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-v11.15.0-linux-armv6l.tar.xz -C /usr/local/lib/nodejs
cd ~/
echo "export PATH=/usr/local/lib/nodejs/node-v11.15.0-linux-armv6l/bin:$PATH" >> .profile
# install yarn
sudo npm i -g yarn
# install alsa, libudev, libusb
sudo apt install -y libasound2-dev libudev-dev libusb-1.0-0-dev
```

## Setup

```sh
yarn install
```

## Run

```sh
yarn run start
```
