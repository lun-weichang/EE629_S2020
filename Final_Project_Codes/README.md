# EE629_S2020 - Indoor Weather Monitor

## Technologies utilized:
* Raspberry Pi 4
* Sense Hat Sensor Board
* Google Sheet

## Available programs to run:

### senseHat_WS_Collector
> Purpose:
Collects temperature, humidity, and pressure data, then inserts these data into the Google Sheet.
> How to run:
```shell
$ python senseHat_WS_Collector.py
```
> Expected outputs:
You should see the CPU usage, system tempearture, environment temperature, pressure and humidity data being printed out in command line.
Also the data should be stored into designated Google spread sheet (remember to modify the GDOCS_SPREADSHEET_NAME and GDOCS_OAUTH_JSON variables).
<img src="https://github.com/lun-weichang/EE629_S2020/blob/master/Pictures/senseHat_WS_Collector.png" title="senseHat_WS_Collector_output" alt="senseHat_WS_Collector_output">
<img src="https://github.com/lun-weichang/EE629_S2020/blob/master/Pictures/Google_Sheet_Data.PNG" title="senseHat_WS_Data_Google" alt="senseHat_WS_Data_Google">

### senseHat_Joystick
> Purpose:
Demonstrates how sense Hat's joystick and LED panel work.
> How to run:
```shell
$ python senseHat_Joystick.py
```
> Expected outputs: 
The following actions are available with the joystick: 
- Press-Up: Prints out the system_time in both terminal and LED panel.
- Press-Down: Prints out the environment temperature in both terminal and LED panel.
- Press-Left: Prints out the environment pressure in both terminal and LED panel.
- Press-Right: Prints out the environment humidity in both terminal and LED panel.
- Press-Middle: Terminate the program
<img src="https://github.com/lun-weichang/EE629_S2020/blob/master/Pictures/senseHat_Joystick.png" title="senseHat_Joystick_output" alt="senseHat_Joystick_output">

