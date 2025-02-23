import axios from 'axios'
import { GetDomainName } from './RestOperationsUtil'
import { plainToInstance } from 'class-transformer'
import MasterpieceBackendContribution from './MasterpieceBackendContribution'
import { UserProfileData } from '../LoginUtils/UserProfileData'

const masterpieceApiURL = GetDomainName() + '/api/v1/masterpiece'
const s3FilesApiURL = GetDomainName() + '/api/v1/s3Files'

const postMasterpiece = '/postMasterpiece'
const getMasterpieceData = '/getMasterpieceData'
const getRandomMasterpieceData = '/getRandomMasterpieceData'
const getUrlGet = '/urlGet'
const getUrlPostMp3s = '/urlPostMp3s'
const getRandom = '/getRandomMasterpieceId'
const getHistory = '/getAllMasterpieceHistory'
const getMasterpieceTitle = '/getMasterpieceTitle'

const HISTORY_AMOUNT = 200

export const PostMPContribution = async (mpContribution: MasterpieceBackendContribution): Promise<void> => {
    const res2 = await axios.post(masterpieceApiURL + postMasterpiece, mpContribution)
    console.log(res2.status)
    alert('This song\'s id is: ' + String(res2.data) + '\n Data may be destroyed after a month of creation') // TODO: Move to a different spot, this isn't a good place for this
    // console.log('status: ' + res2.status.toString())
}

export const GetServerRandomMP = async (): Promise<number | null> => {
    const ext = UserProfileData.getInstance()?.userId ?? ''
    const res = await axios.get(masterpieceApiURL + getRandom + '/' + ext)
    console.log(res.status)
    if (typeof (res.data) === 'number') {
        return res.data
    } else {
        return null
    }
}

export const GetAllUserMPHistory = async (userId: string): Promise<number[] | null> => {
    const page = 0 // TODO implement pagination
    const res = await axios.get(masterpieceApiURL + getHistory + '/' + userId + '/' + page.toString() + '/' + HISTORY_AMOUNT.toString())
    console.log(res.status)
    if (typeof (res.data[0]) === 'number') {
        return res.data
    } else {
        return null
    }
}

export const GetS3FilesURLGet = async (filenames: string[]): Promise<string[] | null> => {
    // NOTE ORDER DOES MATTER FOR FILENAMES/ returning the string array, must make changes to make it not sequential
    // console.log('S3: getting s3 link for get')

    let filesInUrlListForm = ''
    filenames.forEach((value) => { filesInUrlListForm += value + ',' })
    filesInUrlListForm = filesInUrlListForm.slice(0, -1) // to remove last comma

    const res = await axios.get(s3FilesApiURL + getUrlGet + '/' + filesInUrlListForm)
    // console.log(res.status)

    if (typeof (res.data[0]) === 'string') {
        return res.data
    } else {
        console.error('data is not of type string')
        return null
    }
}

export const GetS3FilesURLPost = async (fileNum: number): Promise<string[] | null> => {
    // console.log('S3: getting s3 link for post')
    const res = await axios.get(s3FilesApiURL + getUrlPostMp3s + '/' + fileNum.toString())
    // console.log(res.status)
    // console.log(res.data[0])

    if (typeof (res.data[0]) === 'string') { // FIXME not correct checking done here
        return res.data
    } else {
        console.error('data is not of type string')
        return null
    }
}

export const GetMasterpieceData = async (id: number): Promise<MasterpieceBackendContribution | null> => {
    // console.log('getting masterpiece data by id')

    const res = await axios.get(masterpieceApiURL + getMasterpieceData + '/' + id.toString())

    // console.log(res.status)
    const cls = MasterpieceBackendContribution
    const contribution = plainToInstance(cls, res.data)
    // plainToInstance will return a MasterpieceBackendContribution NOT MasterpieceBackendContribution[] despite what the ide says
    // as a fail safe for this, return null if plainToInstance actually calls MasterpieceBackendContribution[].
    // I'm pretty sure it is glitching because plainToInstance is an overloaded function that can also return the array version of it
    if (contribution instanceof MasterpieceBackendContribution) {
        return contribution
    } else {
        return null
    }
}

export const GetMasterpieceTitle = async (id: number): Promise<string | null> => {
    const res = await axios.get(masterpieceApiURL + getMasterpieceTitle + '/' + id.toString())
    if (typeof (res.data) === 'string') {
        return res.data
    } else {
        return null
    }
}

export const GetRandomMasterpieceData = async (): Promise<void> => {
    // console.log('getting random masterpiece data')

    const res = await axios.get(masterpieceApiURL + getRandomMasterpieceData)

    console.log(res)
}
