import pandas as pd
import numpy as np
import json
import openpyxl as op
import sys
import os
from datetime import datetime 

TIMETABLE_NAME = sys.argv[1]
batchCoursesList = []
periodsList = []
daysListEnumerated = []
batchesEnumerated = []
subjectSectionCombo = []

def getCourses(timetableName, sheetName):
    strippedValues = []
    sheet = pd.read_excel(timetableName, sheet_name=sheetName)
    subjectCode = sheet["Unnamed: 4"]
    subjectCode = subjectCode.dropna()
    subjectCode = subjectCode[subjectCode.str.contains("Short") == False]
    values = subjectCode.values.tolist()
    for value in values:
        strippedValues.append(value.strip())
    return strippedValues

def getSlots(sheet):
    slotList = []
    columnsLength = len(sheet.columns)
    for rowIndex in range(1,2):
        for columnIndex in range (1, columnsLength):
            if type(sheet.iloc[rowIndex, columnIndex]) != np.nan:
                slotList.append(sheet.iloc[rowIndex, columnIndex])
            
    return slotList

def extractWorksheetName(timetable):
    daysList = []
    
    wb = op.load_workbook(timetable)
    worksheets = wb.sheetnames
    del worksheets[0]
    worksheets.remove("Course Pairing")
    worksheets
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', "saturday", "sunday"]
    for idx, value in enumerate(worksheets):
        if value.lower().strip() in days:
            daysList.append(worksheets[idx])

    batchesList = [value for value in worksheets if value not in daysList]
    return daysList, batchesList

def getAllPeriods(sheet):
    rowsLength = len(sheet)
    columnsLength = len(sheet.columns)
    classesList = []
    for rowIndex in range(3,rowsLength):
            for columnIndex in range (1, columnsLength):
                slotDetail = sheet.iloc[rowIndex, columnIndex]
                if type(slotDetail) != float and slotDetail != np.nan and type(slotDetail) != np.float64:
                    if slotDetail.find("\n") != -1:
                        slotTeacher = slotDetail.split("\n")
                        slotSeperated = slotTeacher[0].split(" ")
                        print(slotSeperated)
                        if len(slotSeperated) > 1:
                            if len(slotSeperated) > 2:
                                section = slotSeperated[2].strip()
                                subject = slotSeperated[0].strip() + "-" + slotSeperated[1].strip()
                            else:
                                section = slotSeperated[1].strip()
                                subject = slotSeperated[0].strip()
                        else:
                            slotSeperated = slotTeacher[0].split("-")
                            if len(slotSeperated) > 1:
                                section = slotSeperated[1].strip() + "-" + slotSeperated[2].strip()
                                subject = slotSeperated[0].strip()
                        teacher = slotTeacher[1].strip()
                        slot = sheet.iloc[0, columnIndex]
                        room = sheet.iloc[rowIndex, 0]
                        roomSeparated = room.split("(")
                        finalRoom = roomSeparated[0].strip()
                        classesList.append({"subject":subject, "section":section, "slot": slot, "room":finalRoom, "teacher":teacher})
                        subjectSectionCombo.append({"subject":subject, "section":section, "teacher":teacher})

    return classesList

daysList, batchesList = extractWorksheetName(TIMETABLE_NAME)

for index, value in enumerate(batchesList):
    courseList = getCourses(TIMETABLE_NAME, value)
    batchCoursesList.append(courseList)
    batchesEnumerated.append({"value": index, "course":value})

for index, value in enumerate(daysList):
    sheet = pd.read_excel(TIMETABLE_NAME, sheet_name=value)
    slotList = getSlots(sheet)
    classesList = getAllPeriods(sheet)
    periodsList.append({"slots": slotList, "classes": classesList})
    daysListEnumerated.append({"value": index, "day":value})

fileName = TIMETABLE_NAME.split("-")
timetableVersion = "Unknown"
if len(fileName) > 1:
    timetableVersion = fileName[1].split(".")
    if len(timetableVersion) > 2:
        timetableVersion = timetableVersion[0] + "." + timetableVersion[1]
    else:
        timetableVersion = timetableVersion[0]

comboDataFrame = pd.DataFrame(subjectSectionCombo)
comboDataFrame = comboDataFrame.drop_duplicates()
comboDataFrame['id'] = comboDataFrame.index
subjectSectionComboList = comboDataFrame.to_dict('records')

directory = os.getcwd()
directorySeperated = directory.split("\\")
directorySeperated.pop()
finalDirectory = "\\".join(directorySeperated) + "\\data\\timetable.js"

now = datetime.now()
dt_string = now.strftime("%Y-/%m-/%d %H:%M:%S")

f = open(finalDirectory, "w")
f.write("export const timetableVersion = '" + timetableVersion + "'\n")
f.write("export const timetable = ")
f.write(json.dumps(periodsList))
f.write("\nexport const batchesCoursesList = ")
f.write(json.dumps(batchCoursesList))
f.write("\nexport const daysList = ")
f.write(json.dumps(daysListEnumerated))
f.write("\nexport const batchesEnumerated = ")
f.write(json.dumps(batchesEnumerated))
f.write("\nexport const subjectSectionCombo = ")
f.write(json.dumps(subjectSectionComboList))
f.write("\nexport const lastUpdated = '" + dt_string + "'")
f.close()