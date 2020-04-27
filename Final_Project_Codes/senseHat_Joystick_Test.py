#!/usr/bin/python
import time
import sys
import datetime
from sense_hat import SenseHat
from time import sleep
from system_info import get_temperature

#initializes sense head
sense = SenseHat()
sense.clear()

#wait for joystick event test
while True:
    dataType = None
    dataInfo = None
    event = sense.stick.wait_for_event()
    print("The joystick was {} {}".format(event.action, event.direction))
    event_action = str(event.action)
    event_direction = str(event.direction)
    if (event_action == "pressed" and event_direction == "middle"):
        sense.show_message("Middle")
        dataType = "dateTime"
        dataInfo = datetime.datetime.now()
    elif (event_action == "pressed" and event_direction == "up"):
        sense.show_message("Up")
        dataType = "system_temp"
        dataInfo = get_temperature()
    elif (event_action == "pressed" and event_direction == "down"):
        sense.show_message("Down")
        dataType = "evn_temp"
        dataInfo = sense.get_temperature()
    elif (event_action == "pressed" and event_direction == "right"):
        sense.show_message("Right")
        dataType = "env_humidity"
        dataInfo = sense.get_humidity()
    elif (event_action == "pressed" and event_direction == "left"):
        sense.show_message("Left")
        dataType = "env_humidity"
        dataInfo = sense.get_humidity()
    print("{} = {}".format(dataType, dataInfo))    
    sleep(0.1)
    event = sense.stick.wait_for_event()
    print("The joystick was {} {}".format(event.action, event.direction))
