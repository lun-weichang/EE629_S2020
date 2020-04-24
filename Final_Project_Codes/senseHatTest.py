#!/usr/bin/python
from sense_hat import SenseHat
import time
import sys
import json
import datetime
import gspread
import psutil
import subprocess
from system_info import get_temperature
from oauth2client.service_account import ServiceAccountCredentials

GDOCS_OAUTH_JSON       = 'rpidata-273419-24f27db82190.json'
GDOCS_SPREADSHEET_NAME = 'WS_Data_Sheet'
FREQUENCY_SECONDS      = 10

# functions uses to open the google sheet
def login_open_sheet(oauth_key_file, spreadsheet):
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(oauth_key_file, 
                      scopes = ['https://spreadsheets.google.com/feeds',
                                'https://www.googleapis.com/auth/drive'])
        gc = gspread.authorize(credentials)
        worksheet = gc.open(spreadsheet).temperature
        return worksheet
    except Exception as ex:
        print('Unable to login and get spreadsheet. Check OAuth credentials, spreadsheet name, and')
        print('make sure spreadsheet is shared to the client_email address in the OAuth .json file!')
        print('Google sheet login failed with error:', ex)
        sys.exit(1)

print('Logging sensor measurements to {0} every {1} seconds.'.format(GDOCS_SPREADSHEET_NAME, FREQUENCY_SECONDS))
print('Press Ctrl-C to quit.')
worksheet = None    #reset worksheet variable
sense = SenseHat()
sense.clear()

while True:
    if worksheet is None:
        worksheet = login_open_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME)
    #get the data to be written onto the google sheet
    dat = datetime.datetime.now()
    cpu = psutil.cpu_percent()
    tmp = get_temperature()
    temp = sense.get_temperature()
    temp = round(temp, 1)
    humidity = sense.get_humidity()
    humidity = round(humidity, 1)
    pressure = sense.get_pressure()
    pressure = round(pressure, 1)
    event = sense.stick.wait_for_event()
    print("The joystick was {} {}".format(event.action, event.direction))
    
    print(dat)
    print('CPU Usage in %: '+str(cpu))
    print('Temperature in C: ' +str(tmp))
    
    print("Pressure:", pressure)
    print("Temperature C", temp)
    print("Humidity :", humidity)
    sense.show_message("Current Temp: {}".format(temp))
    sense.show_message("Current Temp: {}".format(temp))
    sense.show_message("Current Humidity: {}".format(temp))
    #sets the column title of the spread sheet
    try:

    except:

    #appends the data to the google sheet
    try:
        #set A1:B1 to bold
        worksheet.format('A1:B1', {'textFormat': {'bold': True}})
        #appends the data into the google sheet
        worksheet.append_row((str(dat), cpu, tmp, str(pressure), str(temp), str(humidity)))
    except:
        print('Append error, logging in again')
        worksheet = None
        time.sleep(FREQUENCY_SECONDS)
        continue
    print('Wrote a row to {0}'.format(GDOCS_SPREADSHEET_NAME))
    time.sleep(FREQUENCY_SECONDS)


sense.clear()
