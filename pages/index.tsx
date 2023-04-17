import { TimetableObject } from "@/interface/timetable";
import {
  Fade,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { ChangeEvent, useEffect, useState } from "react";
import { daysList, timetable, timetableVersion } from "../data/timetable";
import axios from "axios";
import Head from "next/head";

export default function Home({
  dayNumber,
  tempTimetable,
  timetableVersionNumber,
}: {
  dayNumber: number;
  tempTimetable: TimetableObject;
  timetableVersionNumber: string;
}) {
  const [day, setDay] = useState<number>(dayNumber);
  const [data, setData] = useState<TimetableObject>(tempTimetable);
  const [section, setSection] = useState<string>("BSE-6A");
  const [teacherData, setTeacherData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      console.log(day);
      let response = await axios.post("/api/timetable", { day: day });
      setData(response.data.timetableObject);
    }
    fetchData();
  }, [day]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as unknown as number);
  };

  const handleTeacherNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTeacherData(event.target.checked);
  };

  return (
    <div>
      <div>
        <Head>
          <title>Timetable Viewer</title>
        </Head>
      </div>

      <Fade in={true} timeout={1000}>
        <Grid container>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Timetable Viewer</Typography>
            <Typography variant="h5">
              Timetable Version: {timetableVersionNumber}
            </Typography>
          </Grid>
          <Grid
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={teacherData}
                  onChange={handleTeacherNameChange}
                />
              }
              label="Teacher Name"
            />

            <InputLabel id="daySelector" sx={{ ml: 1, mr: 1 }}>
              Day
            </InputLabel>
            <Select
              labelId="daySelector"
              value={day.toString()}
              onChange={handleDayChange}
            >
              {daysList.map((object) => {
                // console.log(object);
                return (
                  <MenuItem key={object.value} value={object.value}>
                    {object.day}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>

          <Grid xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Slot</TableCell>
                    <TableCell>Subject</TableCell>
                    <TableCell>Section</TableCell>
                    <TableCell>Room</TableCell>
                    <Fade in={teacherData} timeout={1000}>
                      <TableCell
                        style={{ display: teacherData ? "block" : "none" }}
                      >
                        Teacher Name
                      </TableCell>
                    </Fade>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.classes.map((object, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{data.slots[object.slot - 1]}</TableCell>
                        <TableCell>{object.subject}</TableCell>
                        <TableCell>{object.section}</TableCell>
                        <TableCell>{object.room}</TableCell>
                        <Fade in={teacherData} timeout={1000}>
                          <TableCell
                            style={{ display: teacherData ? "block" : "none" }}
                          >
                            {object.teacher}
                          </TableCell>
                        </Fade>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid xs={12}>
            <Typography sx={{ textAlign: "center", mt: 2, color: "gray" }}>
              App Version: 0.0.1
            </Typography>
          </Grid>
        </Grid>
      </Fade>
    </div>
  );
}

//serversideprops
export async function getServerSideProps() {
  let todayDate = new Date();
  let finalDay = 0;
  let today = todayDate.getDay();

  if (today < 1 || today > 5) {
    finalDay = 0;
  } else {
    finalDay = today - 1;
  }

  return {
    props: {
      dayNumber: finalDay,
      tempTimetable: timetable[0],
      timetableVersionNumber: timetableVersion,
    },
  };
}
