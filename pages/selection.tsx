import { SubjectSection } from "@/interface/timetable"
import {subjectSectionCombo} from "../data/timetable"
import Grid from "@mui/material/Unstable_Grid2";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, TableContainer, TextField, Typography, Table, TableRow, TableCell, TableHead, TableBody } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useRouter } from "next/router";
import {Delete, ExpandMore} from "@mui/icons-material"
import Link from "next/link";


export default function Selection() {
    const [courses, setCourses] = useState<SubjectSection[]>([]);
    const [tempCourses, setTempCourses] = useState<SubjectSection[]>([]);
    const [search, setSearch] = useState<string>("");
    const [coursesFullList, setCoursesFullList] = useState<SubjectSection[]>([])
    const [coursesList, setCoursesList] = useState<SubjectSection[]>(subjectSectionCombo)
    const [accordionSelected, setAccordionSelected] = useState<string | false>("selection")
    const router = useRouter()
    const columns = [
        {field: "subject", headerName: "Subject", width: 200},
        {field: "section", headerName: "Section", width: 200},
        {field: "teacher", headerName: "Teacher", width: 200},
    ]

    useEffect(() => {
        let storedCourses : SubjectSection[] = []
        if (localStorage.getItem("courses") !== null) {
            storedCourses = JSON.parse(localStorage.getItem("courses") as string)
        }
        if (storedCourses?.length !== 0) {
            setCourses(storedCourses)
            setAccordionSelected("selected")
        }
    }, [])

    useEffect(() => {
        let removeAlreadyAdded : SubjectSection[] = []
        let searchFiltered = coursesList.filter((course) => {
            return course.subject.toLowerCase().includes(search.toLowerCase()) || course.section.toLowerCase().includes(search.toLowerCase()) || course.teacher.toLowerCase().includes(search.toLowerCase())
        })
        removeAlreadyAdded = searchFiltered.filter((course) => {
            return !courses.some((course2) => {return course.id == course2.id})
        })
        setCoursesFullList(removeAlreadyAdded)
    }, [search, coursesList, courses])

    const handleRowChange = (selectedRows: GridRowSelectionModel) => {
        setTempCourses(coursesList.filter((course) => {
            return selectedRows.some((row) => {return course.id == row})
        }))
    }

    const handleSaveCourses = () => {
        if (tempCourses.length === 0) {
            alert("Please select at least one course!")
            return
        }
        setCourses(courses.concat(tempCourses))
        localStorage.setItem("courses", JSON.stringify(courses.concat(tempCourses)))
        localStorage.setItem("coursesUpdated", "true")
        setAccordionSelected("selected")
    }

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
        setAccordionSelected(panel === accordionSelected ? false : panel)
    }

    const handleCourseDelete = (id: number) => {
        let updatedList = courses.filter((course) => {
            return course.id !== id
        })
        setCourses(updatedList)
        localStorage.setItem("courses", JSON.stringify(updatedList))
        localStorage.setItem("coursesUpdated", "true")
    }

    return (
        <div>
            <div>
                <Head>
                    <title>Subject Selection | Timetable Viewer</title>
                </Head>
            </div>

            <div>
                <Grid container sx={{paddingTop: "2%"}}>
                    <Grid xs={12}>
                        <Typography variant="h3" sx={{textAlign: "center"}}>Subject Selection</Typography>    
                    </Grid>
                    <Grid xs={12} sx={{paddingY: "1%", display: "flex", justifyContent: "flex-end"}}>
                        <Button variant="contained"><Link href="/">Show Timetable</Link></Button>
                    </Grid>
                    <Grid xs={12}>
                        <Accordion expanded={accordionSelected === "selection"} onChange={handleAccordionChange("selection")}>
                            <AccordionSummary expandIcon={<ExpandMore />}><Typography>Course Selecion</Typography></AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid xs={12} sx={{display: "flex", justifyContent: "center", alignItems: "center", paddingTop: "1%"}}>
                                        <TextField placeholder="Search" label="Search" value={search} onChange={(value) => {setSearch(value.target.value)}} />
                                    </Grid>
                                    <Grid xs={12} sx={{paddingTop: "2%", paddingX: "5%"}}>
                                        <DataGrid rows={coursesFullList} columns={columns} checkboxSelection initialState={{pagination: {paginationModel: {page: 0, pageSize: 5}}}} pageSizeOptions={[5, 10, 15, 20]} onRowSelectionModelChange={handleRowChange} />
                                    </Grid>
                                    <Grid xs={12} sx={{paddingTop: "2%", display: "flex", justifyContent: "flex-end"}}>
                                        <Button variant="contained" onClick={handleSaveCourses}>Save Courses</Button>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={accordionSelected === "selected"} onChange={handleAccordionChange("selected")}>
                            <AccordionSummary expandIcon={<ExpandMore />}><Typography>Course Selecion</Typography></AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid xs={12}>
                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{textAlign: "center"}}>
                                                        <TableCell>Subject</TableCell>
                                                        <TableCell>Section</TableCell>
                                                        <TableCell>Teacher</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {courses.map((course) => {
                                                        console.log(course)
                                                        return (
                                                            <TableRow key={course.id}>
                                                                <TableCell><Typography>{course.subject}</Typography></TableCell>
                                                                <TableCell><Typography>{course.section}</Typography></TableCell>
                                                                <TableCell><Typography>{course.teacher}</Typography></TableCell>
                                                                <TableCell><Button variant="contained" color="error" onClick={() => {handleCourseDelete(course.id)}}><Delete/> Delete</Button></TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}