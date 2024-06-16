import axios from "axios";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function insertUser(name: string, rollNo: string, batch: string, courseName: string, collegeName: string,sgpa:string){
  const res = await prisma.user.create({
      data:{
          name,
          rollNo,
          batch,
          courseName,
          collegeName,
          sgpa
      }
  })

  console.log(res)
}

async function getSgpa(rollNo:string, semId:string, type: string){
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://results.bput.ac.in/student-results-sgpa?rollNo=${rollNo}&semid=${semId}&session=${type}%20(2023-24)`,
        headers: { 
          'accept': '*/*', 
          'accept-language': 'en-US,en;q=0.9', 
          'content-length': '0', 
          'content-type': 'application/json; charset=utf-8', 
          'origin': 'https://results.bput.ac.in', 
          'priority': 'u=1, i', 
          'referer': 'https://results.bput.ac.in/', 
          'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
          'sec-ch-ua-mobile': '?0', 
          'sec-ch-ua-platform': '"Windows"', 
          'sec-fetch-dest': 'empty', 
          'sec-fetch-mode': 'cors', 
          'sec-fetch-site': 'same-origin', 
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
          'x-requested-with': 'XMLHttpRequest'
        }
      };
      
      const response = await axios.request(config);
      const jsonData = response.data;
    //   console.log(jsonData)
      return({
        totalGradePoints: jsonData.totalGradePoints,
        sgpa: jsonData.sgpa
      })
    //   .then((response) => {
    //     console.log(JSON.stringify(response.data));
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
}

async function getDetails(rollNo:string){
let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `https://results.bput.ac.in/student-detsils-results?rollNo=${rollNo}`,
  headers: { 
    'accept': '*/*', 
    'accept-language': 'en-US,en;q=0.9', 
    'content-length': '0', 
    'content-type': 'application/json; charset=utf-8', 
    'origin': 'https://results.bput.ac.in', 
    'priority': 'u=1, i', 
    'referer': 'https://results.bput.ac.in/', 
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'empty', 
    'sec-fetch-mode': 'cors', 
    'sec-fetch-site': 'same-origin', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', 
    'x-requested-with': 'XMLHttpRequest'
  }
};

const response = await axios.request(config)
const jsonData = response.data;
return ({
    rollNo: jsonData.rollNo,
    studentName: jsonData.studentName,
    batch: jsonData.batch,
    courseName: jsonData.courseName,
    collegeName: jsonData.collegeName
})

}

async function fetchData(rollNo:string, semId:string, type: string) {
    const sgpadata = await getSgpa(rollNo,semId,type);
    const userDetail = await getDetails(rollNo);
    // console.log(sgpadata,
    //         userDetail
    // )
    return({
        userDetail,
        sgpadata,
    })
}
// console.log(fetchData("2301204132","1","Odd"));

async function main(){

    for(let i = 2301204183; i < 2301205000;i++){
        const data = await fetchData(i.toString(),"1","Odd");
        if(data){
            const studentName = data.userDetail.studentName;
            const rollNo = data.userDetail.rollNo;
            const batch = data.userDetail.batch;
            const courseName = data.userDetail.courseName;
            const collegeName = data.userDetail.collegeName;
            const sgpa = data.sgpadata.sgpa;

            insertUser(studentName,rollNo,batch,courseName,collegeName,sgpa)
        }
    }
}
main();