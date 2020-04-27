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

GDOCS_OAUTH_JSON       = 'ee629-final-project-a659f07e9adc.json'
GDOCS_SPREADSHEET_NAME = 'WS_Data_Sheet'
FREQUENCY_SECONDS      = 10

# functions uses to open the temperature sheet
def open_google_sheet(oauth_key_file, spreadsheet):
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(oauth_key_file, 
                      scopes = ['https://spreadsheets.google.com/feeds',
                                'https://www.googleapis.com/auth/drive'])
        gc = gspread.authorize(credentials)
        google_sheet = gc.open(spreadsheet).temperature
        return google_sheet
    except Exception as ex:
        print('Unable to login and get spreadsheet. Check OAuth credentials, spreadsheet name, and')
        print('make sure spreadsheet is shared to the client_email address in the OAuth .json file!')
        print('Google sheet login failed with error:', ex)
        sys.exit(1)

print('Logging sensor measurements to {0} every {1} seconds.'.format(GDOCS_SPREADSHEET_NAME, FREQUENCY_SECONDS))
print('Press Ctrl-C to quit.')
temperature_sheet = None
humidity_sheet = None
pressure_sheet = None

sense = SenseHat()
sense.clear()

while True:
    if temperature_sheet is None:
        temperature_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME)
    if humidity_sheet is None:
        humidity_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME)
    if pressure_sheet is None:
        pressure_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME)
    #get the data to be written onto the google sheet
    system_datetime = datetime.datetime.now()
    system_cpu = psutil.cpu_percent()
    system_temp = get_temperature()
    temp = round(sense.get_temperature(), 1)
    #temp = round(temp, 1)
    humidity = sense.get_humidity()
    humidity = round(humidity, 1)
    pressure = sense.get_pressure()
    pressure = round(pressure, 1)
    event = sense.stick.wait_for_event()
    print("The joystick was {} {}".format(event.action, event.direction))
    
    print(system_datetime)
    print('CPU Usage in %: '+str(system_cpu))
    print('Temperature in C: ' +str(system_temp))
    
    print("Pressure:", pressure)
    print("Temperature C", temp)
    print("Humidity :", humidity)
    sense.show_message("Current Temp: {}".format(temp))
    sense.show_message("Current Temp: {}".format(temp))
    sense.show_message("Current Humidity: {}".format(temp))
    #sets the column title of the spread sheet
    try:
        temperature_sheet.update('A1', 'System_DateTime')
        temperature_sheet.update('B1', 'System_CPU')
        temperature_sheet.update('C1', 'System_Temp')
        temperature_sheet.update('D1', 'Env_Temp')
    except:
        print('Append error, logging in again')
        temperature_sheet = None
        time.sleep(FREQUENCY_SECONDS)
        continue

    #appends the data to the google sheet
    try:
        #set A1:D1 to bold
        temperature_sheet.format('A1:D1', {'textFormat': {'bold': True}})
        #appends the data into the google sheet
        temperature_sheet.append_row((str(system_datetime), system_cpu, system_temp, str(temp)))
    except:
        print('Append error, logging in again')
        temperature_sheet = None
        time.sleep(FREQUENCY_SECONDS)
        continue
    print('Wrote a row to {0}'.format(GDOCS_SPREADSHEET_NAME))
    time.sleep(FREQUENCY_SECONDS)


sense.clear()
