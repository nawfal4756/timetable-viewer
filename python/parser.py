import pandas as pd
import json
import openpyxl as op
import sys
import os

TIMETABLE_NAME = sys.argv[1]
batchCoursesList = []
periodsList = []

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
    rowsLength = len(sheet)
    columnsLength = len(sheet.columns)
    for rowIndex in range(1,2):
        for columnIndex in range (1, columnsLength):
            slotList.append({columnIndex: sheet.iloc[rowIndex, columnIndex]})
            
    return slotList

def extractWorksheetName(timetable):
    daysList = []
    
    wb = op.load_workbook(timetable)
    worksheets = wb.sheetnames
    del worksheets[0]
    worksheets.remove("Course Pairing Information")
    worksheets
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', "saturday", "sunday"]
    for idx, value in enumerate(worksheets):
        if value.lower() in days:
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
                if (type(slotDetail) != float):
                    if slotDetail.find("\n") != -1:
                        slotTeacher = slotDetail.split("\n")
                        slotSeperated = slotTeacher[0].split(" ")
                        subject = slotSeperated[0].strip()
                        if len(slotSeperated) > 2:
                            section = slotSeperated[2].strip()
                        else:
                            section = slotSeperated[1].strip()
                        teacher = slotTeacher[1].strip()
                        slot = sheet.iloc[0, columnIndex]
                        room = sheet.iloc[rowIndex, 0]
                        roomSeparated = room.split("(")
                        finalRoom = roomSeparated[0].strip()
                        classesList.append({"subject":subject, "section":section, "slot": slot, "room":finalRoom, "teacher":teacher})

    return classesList

daysList, batchesList = extractWorksheetName(TIMETABLE_NAME)

for value in batchesList:
    courseList = getCourses(TIMETABLE_NAME, value)
    batchCoursesList.append({value: courseList})

for value in daysList:
    sheet = pd.read_excel(TIMETABLE_NAME, sheet_name=daysList[0])
    slotList = getSlots(sheet)
    classesList = getAllPeriods(sheet)
    periodsList.append({value: {"slots": slotList, "classes": classesList}})

directory = os.getcwd()
directorySeperated = directory.split("\\")
directorySeperated.pop()
finalDirectory = "\\".join(directorySeperated) + "\\data\\timetable.js"

f = open(finalDirectory, "w")
f.write("export const timetable = ")
f.write(json.dumps(periodsList))
f.write("\nexport const batchesCoursesList = ")
f.write(json.dumps(batchCoursesList))
f.close()