#!/usr/bin/python
from sense_hat import SenseHat
from time import sleep
import time
import sys

sense = SenseHat()
sense.clear()

#wait for joystick event test
event = sense.stick.wait_for_event()
print("The joystick was {} {}".format(event.action, event.direction))
sleep(0.1)
event = sense.stick.wait_for_event()
print("The joystick was {} {}".format(event.action, event.direction))