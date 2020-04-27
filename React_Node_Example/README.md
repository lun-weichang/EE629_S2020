# EE629_S2020 - React/Node Example

## Getting Started

### Install Node and NPM
- First, find out the Node.js version you need by running the following command:
```
$ uname -m
```
- Download Node.js from the [official site](https://nodejs.org/en/download/)

- Use tar command to extract the node.js file
```
$ tar -xzf node-v8.9.0-linux-armv7.tar.gz
```
- Copy Node to usr/local directory
```
$ cd node-v6.11.1-linux-armv6l/
$ sudo cp -R * /usr/local/
```
- Run the following commands to check if Node and NPM have been installed correctly:
```
$ node -v
$ npm -v
```

### Install NPM moduels
- Navigate to the React_Node_Example directory
```
$ cd ~/EE629_S2020/React_Node_Example/
```
- Install necessary NPM modules
```
$ npm install
```
- Navigate to React_Node_Example directory 
- Check if a new node_modules directory has been genereated:
```
$ cd ~/EE629_S2020/React_Node_Example/
$ ls
```

### Start the Node Program
- Run script to start the Pokemon website server
```
$ npm start
```

### Open the Pokemon website
- Open a browser
- Home Page: http://localhost:3000/
- Pokemon Page: http://localhost:3000/pokemon/page/0
- Berries Page: http://localhost:3000/berries/page/0
- Machines Page: http://localhost:3000/machines/page/0

## Additional Tutorials and Resources:
* <a href="https://reactjs.org/tutorial/tutorial.html" target="_blank">Install Node.js and Npm on Raspberry Pi</a>
* <a href="https://reactjs.org/tutorial/tutorial.html" target="_blank">Intro to React</a>
* <a href="https://www.digitalocean.com/community/tutorials/getting-started-with-react-hooks" target="_blank">Getting Started with React Hooks</a>
* <a href="https://blog.logrocket.com/a-guide-to-usestate-in-react-ecb9952e406c/" target="_blank">useState in React</a>
