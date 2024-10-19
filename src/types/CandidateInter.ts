export interface CandidateInter {
  id: number,
  name: string,
  status: number,
  createTime:Date
}

export interface CandidateRecordInter {
  id: number,
  candidateId: number,
  candidateName: string,
  userRecord: Array<OneRecordInter>,
  candidateRecord: Array<OneRecordInter>,
  dateXAxisData: Array<string>,
  userYAxisData: Array<number>,
  candidateYAxisData: Array<number>,
}

export interface OneRecordInter {
  date: string,
  totalCnt: number,
  successCnt: number,
  explanation: string
}