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

GDOCS_OAUTH_JSON       = 'ee629wsproject-7d249e8f524e.json'
GDOCS_SPREADSHEET_NAME = 'WS_Data_Sheet'
FREQUENCY_SECONDS      = 10

# functions uses to open the temperature sheet
def open_google_sheet(oauth_key_file, spreadsheet, sheetName):
    try:
        credentials = ServiceAccountCredentials.from_json_keyfile_name(oauth_key_file, 
                      scopes = ['https://spreadsheets.google.com/feeds',
                                'https://www.googleapis.com/auth/drive'])
        gc = gspread.authorize(credentials)
        google_sheet = gc.open(spreadsheet).worksheet(sheetName)
        return google_sheet
    except Exception as ex:
        print('Unable to login and get spreadsheet. Check OAuth credentials, spreadsheet name, and\\n')
        print('make sure spreadsheet is shared to the client_email address in the OAuth .json file!\\n')
        print('Google sheet login failed with error:', ex)
        sys.exit(1)

print('Logging sensor measurements to {0} every {1} seconds.'.format(GDOCS_SPREADSHEET_NAME, FREQUENCY_SECONDS))
print('Press Ctrl-C to quit.')
temperature_sheet = None
humidity_sheet = None
pressure_sheet = None

sense = SenseHat()
sense.clear()


#sets the column title of the spread sheet
try:
    if temperature_sheet is None:
        temperature_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'temperature')
    temperature_sheet.format('A1:D1', {'textFormat': {'bold': True}})
    temperature_sheet.append_row(('Date_Time', 'System_CPU', 'System_Temp', 'Env_Temp'))
    if humidity_sheet is None:
        humidity_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'humidity')
    humidity_sheet.format('A1:D1', {'textFormat': {'bold': True}})
    humidity_sheet.append_row(('Date_Time', 'Humidity'))
    if pressure_sheet is None:
        pressure_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'pressure')
    pressure_sheet.format('A1:D1', {'textFormat': {'bold': True}})
    pressure_sheet.append_row(('Date_Time', 'Pressure'))
except Exception as ex:
    print('Google sheet login failed with error:', ex)
    sys.exit(1)

# determinates whether to stop collecting data
terminate = False

while not terminate:
    if temperature_sheet is None:
        temperature_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'temperature')
    if humidity_sheet is None:
        humidity_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'humidity')
    if pressure_sheet is None:
        pressure_sheet = open_google_sheet(GDOCS_OAUTH_JSON, GDOCS_SPREADSHEET_NAME, 'pressure')
    #get the data to be written onto the google sheet
    system_datetime = datetime.datetime.now()
    system_cpu = psutil.cpu_percent()
    system_temp = get_temperature()
    env_temp = round(sense.get_temperature(), 1)
    #env_temp = round(env_temp, 1)
    env_humidity = sense.get_humidity()
    env_humidity = round(env_humidity, 1)
    env_pressure = sense.get_pressure()
    env_pressure = round(env_pressure, 1)
    event = sense.stick.wait_for_event()
    print("The joystick was {} {}".format(event.action, event.direction))
    
    print(system_datetime)
    print('CPU Usage in %: '+str(system_cpu))
    print('Temperature in C: ' +str(system_temp))
    
    print("Pressure:", env_pressure)
    print("Temperature C", env_temp)
    print("Humidity :", env_humidity)
    # sense.show_message("Current Temp: {}".format(env_temp))
    # sense.show_message("Current Temp: {}".format(env_temp))
    # sense.show_message("Current Humidity: {}".format(env_temp))

    #appends the data to the google sheet
    try:
        #appends the data into the google sheet
        temperature_sheet.append_row((str(system_datetime), system_cpu, system_temp, str(env_temp)))
        humidity_sheet.append_row((str(system_datetime), env_humidity))
        pressure_sheet.append_row((str(system_datetime), env_pressure))
    except:
        print('Append error, logging in again')
        temperature_sheet = None
        time.sleep(FREQUENCY_SECONDS)
        continue
    print('Wrote a row to {}'.format(GDOCS_SPREADSHEET_NAME))
    time.sleep(FREQUENCY_SECONDS)


sense.clear()
