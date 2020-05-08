#!/usr/bin/python
import time
import sys
import datetime
from sense_hat import SenseHat
from time import sleep
from system_info import get_temperature

#initializes sense Hat
sense = SenseHat()
sense.clear()
#initializes pixel colors
red = (255, 0, 0)
orange = (255, 165, 0)
yellow = (255, 255, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
purple = (160, 32, 240)
white = (255, 255, 255)
black = (0, 0, 0)

dataType = None
dataInfo = None
textColor = black
backColor = white
textSpeed = 0.01
#wait for joystick event test
while True:
    
    event = sense.stick.wait_for_event()
    event_action = str(event.action)
    event_direction = str(event.direction)
    if (event_action == "pressed" and event_direction == "middle"):
        print("Terminate the program!")
	break
    elif (event_action == "pressed" and event_direction == "up"):
        print("Get system date time!")
        dataType = "system_time"
        dataInfo = datetime.datetime.now()
    elif (event_action == "pressed" and event_direction == "down"):
        print("Get the environment temperature!")
        dataType = "evn_temp"
        dataInfo = sense.get_temperature()
	dataInfo = round(dataInfo, 1)
	if (dataInfo >= 20):
		textColor = red
	else:
		textColor = blue
    elif (event_action == "pressed" and event_direction == "right"):
        print("Get the environment humidity!")
        dataType = "env_humidity"
        dataInfo = sense.get_humidity()
	dataInfo = round(dataInfo, 1)
	if (dataInfo >= 12):
		textColor = green
	else:
		textColor = yellow
    elif (event_action == "pressed" and event_direction == "left"):
        print("Get the environment pressure!")
        dataType = "env_pressure"
        dataInfo = sense.get_pressure()
	dataInfo = round(dataInfo, 1)
	if (dataInfo >= 1000):
		textColor = orange
	else:
		textColor = purple
    print("{} = {}".format(dataType, dataInfo))    
    sense.clear(white)
    sense.show_message(("{} = {}".format(dataType, dataInfo)), scroll_speed= textSpeed, text_colour=textColor, back_colour=backColor)
    sense.clear()

sense.clear() #clears the LED panel after exiting
