export interface CandidateInter {
  id: number,
  name: string
  createTime:Date
}

export interface CandidateRecordInter {
  id: number,
  candidateId: number,
  userRecord: Array<OneRecordInter>,
  candidateRecord: Array<OneRecordInter>,
}

export interface OneRecordInter {
  date: string,
  totalCnt: number,
  successCnt: number,
  explanation: string
}