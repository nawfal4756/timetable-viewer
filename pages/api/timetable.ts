// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {timetable} from '../../data/timetable'
import { TimetableObject } from '@/interface/timetable'

type Data = {
  timetableObject: TimetableObject | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    if (req.body.day != null) {
      let tempTimetable = timetable[req.body.day]
      tempTimetable.classes.sort((a, b) : number => { return a.slot - b.slot})
      let finalTimetable = {"slots":tempTimetable.slots, "classes":tempTimetable.classes.filter((value) => {return value.section == "BSE-6A" })}
      res.status(200).json({ timetableObject: finalTimetable })
      return
    }
  }

  res.status(404).json({ timetableObject: null })
}
