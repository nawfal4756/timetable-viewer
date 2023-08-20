// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {timetable} from '../../data/timetable'
import { Classes, TimetableObject } from '@/interface/timetable'

type Data = {
  timetableObject: TimetableObject[] | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    if (req.body.subjectList != null) {
      let timetableFinal: TimetableObject[] = []
      let payload : Classes[] = [];
      payload = req.body.subjectList;
      timetable.forEach((timetablePart) => {
        let tempObject : TimetableObject = {slots: [], classes: []};
        tempObject.slots = timetablePart.slots;
        tempObject.classes = [];
        timetablePart.classes.filter((classObject) => {
          payload.forEach((selectedSubject : Classes) => {
            if (classObject.subject === selectedSubject.subject && classObject.section === selectedSubject.section) {
              tempObject.classes.push(classObject);
            }
          })
        })
        timetableFinal.push(tempObject);
      })
      res.status(200).json({ timetableObject: timetableFinal })
      return
    }
  }

  res.status(404).json({ timetableObject: null })
}
