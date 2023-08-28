import { TimetableObject } from "@/interface/timetable";
import {
  Alert,
  Button,
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
import { daysList, lastUpdated, timetable, timetableVersion } from "../data/timetable";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home({
  dayNumber,
  tempTimetable,
  timetableVersionNumber,
  lastUpdatedDate,
  appVersion
}: {
  dayNumber: number;
  tempTimetable: TimetableObject[];
  timetableVersionNumber: string;
  lastUpdatedDate: string,
  appVersion: string
}) {
  const [day, setDay] = useState<number>(dayNumber);
  const [data, setData] = useState<TimetableObject[]>(tempTimetable);
  const [displayProperty, setDisplayProperty] = useState<string>("none");
  const [teacherData, setTeacherData] = useState<boolean>(false);
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      let response = await axios.post("/api/timetable", { subjectList: JSON.parse(localStorage.getItem("courses")!) });
      setData(response.data.timetableObject);
      localStorage.setItem("timetable", JSON.stringify(response.data.timetableObject));
      localStorage.setItem("timetableVersion", timetableVersionNumber);
      localStorage.setItem("date", new Date().toISOString())
    }

    if (localStorage.getItem("courses") === null) {
      router.push("/selection");
    }
    
    let localStorageDate = localStorage.getItem("date")!;
    if (localStorage.getItem("date") === null || new Date(lastUpdatedDate) > new Date(localStorageDate) || localStorage.getItem("coursesUpdated") == "true") {
      localStorage.setItem("coursesUpdated", "false")
      fetchData();
    }
    else {
      setData(JSON.parse(localStorage.getItem("timetable")!));
    }

  }, [router, timetableVersionNumber, lastUpdatedDate]);

  const handleDayChange = (event: SelectChangeEvent) => {
    setDay(event.target.value as unknown as number);
  };

  const handleTeacherNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    function changeDisplayProperty() {
      if (!event.target.checked) {
        setDisplayProperty("none");
      } else {
        setDisplayProperty("");
      }
    }
    if (!event.target.checked) {
      setTeacherData(event.target.checked);
      setTimeout(changeDisplayProperty, 1000);
    }
    else {
      changeDisplayProperty()
      setTeacherData(event.target.checked);
    }
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
          <Grid xs={12} sx={{paddingY: "2%", display: "flex", justifyContent: "flex-end"}}>
            <Link href="/selection"><Button variant="contained">Course Selection</Button></Link>
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
                        style={{ display: displayProperty }}
                      >
                        Teacher Name
                      </TableCell>
                    </Fade>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data[day].classes.length == 0 ? <TableRow><TableCell colSpan={4} sx={{textAlign: "center"}}><Typography variant="h6">No Classes</Typography></TableCell></TableRow> : data[day]?.classes.sort((a, b) => {return a.slot - b.slot}).map((object, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{data[day].slots[object.slot - 1]}</TableCell>
                        <TableCell>{object.subject}</TableCell>
                        <TableCell>{object.section}</TableCell>
                        <TableCell>{object.room}</TableCell>
                        <Fade in={teacherData} timeout={1000}>
                          <TableCell
                            style={{ display: displayProperty }}
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
              App Version: {appVersion}
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
      tempTimetable: timetable,
      timetableVersionNumber: timetableVersion,
      lastUpdatedDate: lastUpdated,
      appVersion: process.env.npm_package_version,
    },
  };
}
